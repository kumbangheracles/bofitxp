import { useAppTheme } from "@/hooks/use-app-theme";
import {
  useAiCoachSessionMessages,
  useAiCoachSessions,
  useAiCoachActions,
} from "@/hooks/use-ai-coach";
import type { AppTheme } from "@/constants/theme";
import { useAuth } from "@/context/AuthContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import Animated, {
  useSharedValue,
  withDelay,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { AiCoachMessage } from "@/types/aiCoach.type";

type CoachMessage = AiCoachMessage;

const INLINE_PATTERN = /(\*\*[^*]+\*\*|__[^_]+__|\*[^*]+\*|_[^_]+_|`[^`]+`)/g;

type InlineNode = string | { type: "bold" | "italic" | "code"; value: string };

const parseInlineMarkdown = (text: string): InlineNode[] => {
  const nodes: InlineNode[] = [];
  let lastIndex = 0;

  for (const match of text.matchAll(INLINE_PATTERN)) {
    const matchIndex = match.index ?? 0;
    if (matchIndex > lastIndex) {
      nodes.push(text.slice(lastIndex, matchIndex));
    }

    const raw = match[0];
    let value = raw;
    let type: "bold" | "italic" | "code" = "bold";

    if (raw.startsWith("**") || raw.startsWith("__")) {
      value = raw.slice(2, -2);
      type = "bold";
    } else if (raw.startsWith("*") || raw.startsWith("_")) {
      value = raw.slice(1, -1);
      type = "italic";
    } else if (raw.startsWith("`")) {
      value = raw.slice(1, -1);
      type = "code";
    }

    nodes.push({ type, value });
    lastIndex = matchIndex + raw.length;
  }

  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex));
  }

  return nodes;
};

type InlineTextProps = {
  text: string;
  styles: {
    base: any;
    bold?: any;
    italic?: any;
    code?: any;
  };
};

const InlineText = ({ text, styles }: InlineTextProps) => {
  const nodes = parseInlineMarkdown(text);

  return (
    <Text style={styles.base}>
      {nodes.map((node, index) => {
        if (typeof node === "string") {
          return <Text key={`inline-text-${index}`}>{node}</Text>;
        }

        if (node.type === "bold") {
          return (
            <Text
              key={`inline-bold-${index}`}
              style={[styles.base, styles.bold]}
            >
              {node.value}
            </Text>
          );
        }

        if (node.type === "italic") {
          return (
            <Text
              key={`inline-italic-${index}`}
              style={[styles.base, styles.italic]}
            >
              {node.value}
            </Text>
          );
        }

        return (
          <Text key={`inline-code-${index}`} style={[styles.base, styles.code]}>
            {node.value}
          </Text>
        );
      })}
    </Text>
  );
};

type MarkdownTextProps = {
  text: string;
  styles: {
    base: any;
    paragraph?: any;
    bulletRow?: any;
    bullet?: any;
    bulletText?: any;
    bold?: any;
    italic?: any;
    code?: any;
  };
};

const MarkdownText = ({ text, styles }: MarkdownTextProps) => {
  const lines = text
    .replace(/\r\n/g, "\n")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  return lines.map((line, lineIndex) => {
    const bulletMatch = line.match(/^(?:[-*+•]\s+|\d+[.)]\s+)(.*)$/);
    const isBullet = !!bulletMatch;
    const content = isBullet ? bulletMatch![1] : line;

    return (
      <View
        key={`md-line-${lineIndex}`}
        style={isBullet ? styles.bulletRow : undefined}
      >
        {isBullet && <Text style={[styles.bullet, styles.bulletText]}>• </Text>}
        <Text style={styles.base}>
          <InlineText
            text={content}
            styles={{
              base: styles.base,
              bold: styles.bold,
              italic: styles.italic,
              code: styles.code,
            }}
          />
        </Text>
      </View>
    );
  });
};

const sanitizeAiMessageText = (value: string) => {
  if (!value) return "";

  return value
    .replace(/\r\n/g, "\n")
    .replace(/#{1,6}\s+/g, "")
    .replace(/^[-*_]{3,}\s*$/gm, "")
    .replace(/^>\s+/gm, "")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
};

type UseTypewriterReturn = {
  displayed: string;
  isTyping: boolean;
};

function useTypewriter(
  fullText: string,
  enabled: boolean,
  speed: number = 40,
): UseTypewriterReturn {
  const [displayed, setDisplayed] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const indexRef = useRef(0);
  const tokensRef = useRef<string[]>([]);

  useEffect(() => {
    if (!enabled) {
      setDisplayed(fullText);
      setIsTyping(false);
      indexRef.current = 0;
      tokensRef.current = [];
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    const tokens = fullText.split(/(\s+)/);
    if (tokensRef.current.join("") !== fullText) {
      tokensRef.current = tokens;
      indexRef.current = 0;
      setDisplayed("");
      setIsTyping(true);
    }

    intervalRef.current = setInterval(() => {
      if (indexRef.current < tokensRef.current.length) {
        setDisplayed((prev) => prev + tokensRef.current[indexRef.current]);
        indexRef.current += 1;
      } else {
        setIsTyping(false);
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      }
    }, speed);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      setIsTyping(false);
    };
  }, [fullText, enabled, speed]);

  return { displayed, isTyping };
}

type TypingDotsProps = {
  styles: {
    container: any;
    dot: any;
  };
};

const TypingDots = ({ styles }: TypingDotsProps) => {
  const opacity1 = useSharedValue(0);
  const opacity2 = useSharedValue(0);
  const opacity3 = useSharedValue(0);

  useEffect(() => {
    opacity1.value = withRepeat(withTiming(1, { duration: 700 }), -1, true);
    opacity2.value = withRepeat(
      withDelay(250, withTiming(1, { duration: 700 })),
      -1,
      true,
    );
    opacity3.value = withRepeat(
      withDelay(500, withTiming(1, { duration: 700 })),
      -1,
      true,
    );
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.dot, { opacity: opacity1 }]} />
      <Animated.View style={[styles.dot, { opacity: opacity2 }]} />
      <Animated.View style={[styles.dot, { opacity: opacity3 }]} />
    </View>
  );
};

type AiBubbleContentProps = {
  message: CoachMessage;
  animatedText: string;
  isAnimating: boolean;
  styles: {
    bubbleText: any;
    markdownParagraph: any;
    markdownBold: any;
    markdownItalic: any;
    markdownCode: any;
    markdownBullet: any;
    bulletRow: any;
    bullet: any;
    bulletText: any;
  };
};

const AiBubbleContent = ({
  message,
  animatedText,
  isAnimating,
  styles,
}: AiBubbleContentProps) => {
  const textToShow = isAnimating
    ? animatedText
    : sanitizeAiMessageText(message.content);

  return (
    <MarkdownText
      text={textToShow || " "}
      styles={{
        base: styles.bubbleText,
        paragraph: styles.markdownParagraph,
        bulletRow: styles.bulletRow,
        bullet: styles.markdownBullet,
        bulletText: styles.markdownBullet,
        bold: styles.markdownBold,
        italic: styles.markdownItalic,
        code: styles.markdownCode,
      }}
    />
  );
};

type TypingFooterProps = {
  isSending: boolean;
  styles: {
    messageRowLeft: any;
    bubble: any;
    aiBubble: any;
    typingBubble: any;
    typingIndicator: any;
    typingDot: any;
  };
};

const TypingFooter = ({ isSending, styles }: TypingFooterProps) => {
  if (!isSending) return null;

  return (
    <View style={styles.messageRowLeft}>
      <View style={[styles.bubble, styles.aiBubble, styles.typingBubble]}>
        <TypingDots
          styles={{
            container: styles.typingIndicator,
            dot: styles.typingDot,
          }}
        />
      </View>
    </View>
  );
};

export default function AiCoachScreen() {
  const theme = useAppTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const { authUser } = useAuth();
  const insets = useSafeAreaInsets();

  const { data: sessionsData, isLoading: isLoadingSessions } =
    useAiCoachSessions();
  const { createCoachSession, sendCoachMessage, isSendingMessage } =
    useAiCoachActions();

  const safeSessions = Array.isArray(sessionsData) ? sessionsData : [];

  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(
    null,
  );
  const [draft, setDraft] = useState("");

  const [optimisticUserMessage, setOptimisticUserMessage] =
    useState<CoachMessage | null>(null);

  const [animatingMessageId, setAnimatingMessageId] = useState<string | null>(
    null,
  );

  const flatListRef = useRef<FlatList<CoachMessage>>(null);

  const historyLoadedRef = useRef(false);
  const lastHistoryAiMessageIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (!selectedSessionId && safeSessions[0]) {
      setSelectedSessionId(safeSessions[0].id);
    }
  }, [safeSessions, selectedSessionId]);

  const { data: messagesData, isLoading: isLoadingMessages } =
    useAiCoachSessionMessages(selectedSessionId ?? undefined);

  const safeMessages = Array.isArray(messagesData) ? messagesData : [];

  useEffect(() => {
    if (!historyLoadedRef.current && safeMessages.length > 0) {
      historyLoadedRef.current = true;
      const aiMessages = safeMessages.filter((m) => m.sender === "AI");
      if (aiMessages.length > 0) {
        lastHistoryAiMessageIdRef.current =
          aiMessages[aiMessages.length - 1].id;
      }
    }
  }, [safeMessages]);

  useEffect(() => {
    if (!authUser?.id || safeSessions.length) {
      return;
    }

    const bootstrapSession = async () => {
      try {
        const newSession = await createCoachSession();

        if (newSession?.id) {
          setSelectedSessionId(newSession.id);
        }
      } catch (error) {
        console.warn("Failed to initialize AI Coach session:", error);
      }
    };

    void bootstrapSession();
  }, [authUser?.id, safeSessions.length, createCoachSession]);

  const handleSend = async () => {
    const trimmed = draft.trim();
    if (!trimmed || !selectedSessionId) return;

    const tempId = `optimistic-${Date.now()}`;
    const optimisticMsg: CoachMessage = {
      id: tempId,
      sessionId: selectedSessionId,
      sender: "USER",
      content: trimmed,
      createdAt: new Date().toISOString(),
    };

    setOptimisticUserMessage(optimisticMsg);
    setDraft("");

    try {
      await sendCoachMessage(selectedSessionId, { content: trimmed });
    } catch (error) {
      console.warn("Failed to send AI Coach message:", error);
      setDraft(trimmed);
    } finally {
      setOptimisticUserMessage(null);
    }
  };

  const aiMessages = safeMessages.filter((m) => m.sender === "AI");
  const latestAiMessage = aiMessages[aiMessages.length - 1];

  const shouldAnimate = useMemo(() => {
    if (!latestAiMessage) return false;
    if (latestAiMessage.id === lastHistoryAiMessageIdRef.current) return false;
    if (animatingMessageId === latestAiMessage.id) return false;
    return true;
  }, [latestAiMessage, animatingMessageId]);

  useEffect(() => {
    if (shouldAnimate && latestAiMessage) {
      setAnimatingMessageId(latestAiMessage.id);
    }
  }, [shouldAnimate, latestAiMessage]);

  const { displayed: typewriterText, isTyping: typewriterIsTyping } =
    useTypewriter(latestAiMessage?.content ?? "", shouldAnimate, 40);

  const isAiTyping = typewriterIsTyping;

  const displayMessages = useMemo(() => {
    const messages = [...safeMessages];
    if (optimisticUserMessage) {
      const alreadyExists = safeMessages.some(
        (m) => m.id === optimisticUserMessage.id,
      );
      if (!alreadyExists) {
        messages.push(optimisticUserMessage);
      }
    }
    return messages.sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    );
  }, [safeMessages, optimisticUserMessage]);

  const renderMessage = useCallback(
    ({ item }: { item: CoachMessage }) => {
      const isUser = item.sender === "USER";
      const isOptimistic = !!(
        optimisticUserMessage && item.id === optimisticUserMessage.id
      );
      const isAnimatingAi =
        item.sender === "AI" && item.id === animatingMessageId && isAiTyping;

      return (
        <View
          style={[
            styles.messageRow,
            isUser ? styles.messageRowRight : styles.messageRowLeft,
            isOptimistic && styles.optimisticRow,
          ]}
        >
          <View
            style={[
              styles.bubble,
              isUser ? styles.userBubble : styles.aiBubble,
              isOptimistic && styles.optimisticBubble,
            ]}
          >
            {isUser ? (
              <Text style={[styles.messageText, styles.userText]}>
                {item.content || " "}
              </Text>
            ) : (
              <AiBubbleContent
                message={item}
                animatedText={typewriterText}
                isAnimating={isAnimatingAi}
                styles={{
                  bubbleText: styles.messageText,
                  markdownParagraph: styles.markdownParagraph,
                  markdownBold: styles.markdownBold,
                  markdownItalic: styles.markdownItalic,
                  markdownCode: styles.markdownCode,
                  markdownBullet: styles.markdownBullet,
                  bulletRow: styles.bulletRow,
                  bullet: styles.markdownBullet,
                  bulletText: styles.markdownBullet,
                }}
              />
            )}
            {isOptimistic && (
              <View style={styles.optimisticIndicator}>
                <ActivityIndicator size="small" color={theme.text} />
              </View>
            )}
          </View>
        </View>
      );
    },
    [
      animatingMessageId,
      isAiTyping,
      optimisticUserMessage,
      typewriterText,
      styles,
      theme,
    ],
  );

  const scrollToBottom = useCallback(() => {
    flatListRef.current?.scrollToEnd({ animated: true });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [displayMessages.length, typewriterText, scrollToBottom]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
      >
        <LinearGradient
          colors={[theme.primary, theme.primaryHover]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.heroCard, { marginTop: insets.top + 8 }]}
        >
          <View style={styles.heroRow}>
            <View style={styles.avatarWrap}>
              <MaterialCommunityIcons
                name="robot"
                size={24}
                color={theme.surface}
              />
            </View>

            <View style={styles.heroTextWrap}>
              <Text style={styles.heroTitle}>AI Coach</Text>
            </View>
          </View>

          <View style={styles.statusRow}>
            <View style={styles.statusDot} />
            <Text style={styles.statusText}>Online and ready to coach</Text>
          </View>
        </LinearGradient>

        {isLoadingSessions || isLoadingMessages ? (
          <View style={styles.loadingWrap}>
            <ActivityIndicator size="large" color={theme.primary} />
          </View>
        ) : (
          <>
            <FlatList
              ref={flatListRef}
              data={displayMessages}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.chatList}
              keyboardShouldPersistTaps="handled"
              renderItem={renderMessage}
              ListEmptyComponent={
                <View style={styles.emptyState}>
                  <MaterialCommunityIcons
                    name="message-text-outline"
                    size={40}
                    color={theme.textHint}
                  />
                  <Text style={styles.emptyText}>
                    Mulai chat dengan AI Coach
                  </Text>
                </View>
              }
              ListFooterComponent={() => (
                <TypingFooter
                  isSending={isSendingMessage}
                  styles={{
                    messageRowLeft: styles.messageRowLeft,
                    bubble: styles.bubble,
                    aiBubble: styles.aiBubble,
                    typingBubble: styles.typingBubble,
                    typingIndicator: styles.typingIndicator,
                    typingDot: styles.typingDot,
                  }}
                />
              )}
            />
          </>
        )}

        <View style={styles.inputRow}>
          <TextInput
            value={draft}
            onChangeText={setDraft}
            placeholder="Kirim pesan ke AI Coach..."
            placeholderTextColor={theme.textHint}
            multiline
            style={styles.input}
          />

          <Pressable
            onPress={handleSend}
            disabled={!draft.trim() || !selectedSessionId || isSendingMessage}
            style={[
              styles.sendButton,
              (!draft.trim() || !selectedSessionId || isSendingMessage) &&
                styles.sendButtonDisabled,
            ]}
          >
            {isSendingMessage ? (
              <ActivityIndicator size="small" color={theme.surface} />
            ) : (
              <MaterialCommunityIcons
                name="send"
                size={18}
                color={theme.surface}
              />
            )}
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const createStyles = (theme: AppTheme) =>
    StyleSheet.create({
      safeArea: {
        flex: 1,
        backgroundColor: theme.background,
      },
      container: {
        flex: 1,
        backgroundColor: theme.background,
      },
      heroCard: {
        marginHorizontal: 14,
        marginTop: 0,
        paddingHorizontal: 14,
        paddingVertical: 14,
        borderRadius: 24,
        shadowColor: "#6C3FFF",
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.25,
        shadowRadius: 20,
        elevation: 8,
      },
      heroRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
      },
      avatarWrap: {
        width: 46,
        height: 46,
        borderRadius: 16,
        backgroundColor: "rgba(255,255,255,0.2)",
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.35)",
      },
      heroTextWrap: {
        flex: 1,
      },
      heroTitle: {
        fontSize: 18,
        fontWeight: "700",
        color: theme.surface,
      },
      statusRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        marginTop: 12,
      },
      statusDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: "#7CFFB2",
      },
      statusText: {
        color: "rgba(255,255,255,0.86)",
        fontSize: 12,
        fontWeight: "500",
      },
      chatList: {
        padding: 12,
        paddingBottom: 18,
        flexGrow: 1,
      },
      messageRow: {
        flexDirection: "row",
        marginBottom: 10,
      },
      messageRowLeft: {
        justifyContent: "flex-start",
      },
      messageRowRight: {
        justifyContent: "flex-end",
      },
      bubble: {
        maxWidth: "78%",
        borderRadius: 18,
        paddingHorizontal: 14,
        paddingVertical: 10,
      },
      aiBubble: {
        backgroundColor: theme.surface,
        borderWidth: 1,
        borderColor: theme.border,
      },
      userBubble: {
        backgroundColor: theme.primary,
      },
      optimisticRow: {
        opacity: 0.75,
      },
      optimisticBubble: {
        borderColor: theme.border,
        borderStyle: "dashed",
      },
      optimisticIndicator: {
        position: "absolute",
        right: -22,
        top: 10,
      },
      bulletRow: {
        flexDirection: "row",
        alignItems: "flex-start",
        marginBottom: 4,
      },
      bullet: {
        marginTop: 1,
        marginRight: 6,
      },
      markdownBullet: {
        fontSize: 16,
        lineHeight: 22,
        color: theme.text,
        fontWeight: "700",
      },
      typingBubble: {
        maxWidth: "60%",
        minHeight: 40,
        paddingHorizontal: 12,
        paddingVertical: 10,
        borderColor: theme.border,
      },
      typingIndicator: {
        flexDirection: "row",
        gap: 6,
        alignItems: "center",
      },
      typingDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: theme.textHint,
      },
      messageText: {
        fontSize: 14,
        lineHeight: 22,
        color: theme.text,
        textAlign: "left",
      },
      markdownParagraph: {
        fontSize: 14,
        lineHeight: 22,
        color: theme.text,
        marginBottom: 4,
      },
      markdownBold: {
        fontWeight: "700",
        color: theme.text,
      },
      markdownItalic: {
        fontStyle: "italic",
        color: theme.text,
      },
      markdownCode: {
        backgroundColor: theme.elevated,
        borderRadius: 6,
        paddingHorizontal: 4,
        paddingVertical: 2,
        fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
        color: theme.primary,
      },
      userText: {
        color: theme.surface,
      },
      inputRow: {
        flexDirection: "row",
        alignItems: "flex-end",
        gap: 10,
        paddingHorizontal: 12,
        paddingTop: 12,
        paddingBottom: 12,
        borderTopWidth: 1,
        borderTopColor: theme.border,
        backgroundColor: theme.surface,
      },
      input: {
        flex: 1,
        minHeight: 46,
        maxHeight: 120,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: theme.border,
        backgroundColor: theme.elevated,
        paddingHorizontal: 14,
        paddingVertical: 10,
        color: theme.text,
        fontSize: 14,
      },
      sendButton: {
        width: 48,
        height: 48,
        borderRadius: 16,
        backgroundColor: theme.primary,
        alignItems: "center",
        justifyContent: "center",
      },
      sendButtonDisabled: {
        opacity: 0.5,
      },
      emptyState: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 40,
      },
      emptyText: {
        marginTop: 10,
        color: theme.textHint,
        fontSize: 14,
      },
      loadingWrap: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 24,
      },
    });
