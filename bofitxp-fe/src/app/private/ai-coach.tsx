import { useAppTheme } from "@/hooks/use-app-theme";
import {
  useAiCoachSessionMessages,
  useAiCoachSessions,
  useAiCoachActions,
} from "@/hooks/use-ai-coach";
import { AppTheme } from "@/constants/theme";
import { useAuth } from "@/context/AuthContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

const TypingIndicator = () => (
  <View style={stylesTyping.container}>
    <View style={stylesTyping.dot} />
    <View style={stylesTyping.dot} />
    <View style={stylesTyping.dot} />
  </View>
);

export default function AiCoachScreen() {
  const theme = useAppTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const { authUser } = useAuth();

  const { data: sessions = [], isLoading: isLoadingSessions } =
    useAiCoachSessions();
  const {
    createCoachSession,
    sendCoachMessage,
    isCreatingSession,
    isSendingMessage,
  } = useAiCoachActions();

  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(
    null,
  );
  const [draft, setDraft] = useState("");

  useEffect(() => {
    if (!selectedSessionId && sessions[0]) {
      setSelectedSessionId(sessions[0].id);
    }
  }, [sessions, selectedSessionId]);

  const { data: messages = [], isLoading: isLoadingMessages } =
    useAiCoachSessionMessages(selectedSessionId ?? undefined);

  const selectedSession =
    sessions.find((session) => session.id === selectedSessionId) ??
    sessions[0] ??
    null;

  useEffect(() => {
    if (!authUser?.id || sessions.length || isCreatingSession) {
      return;
    }

    const bootstrapSession = async () => {
      try {
        const newSession = await createCoachSession(
          "Motivasi latihan hari ini",
        );

        if (newSession?.id) {
          setSelectedSessionId(newSession.id);
        }
      } catch (error) {
        console.warn("Failed to initialize AI Coach session:", error);
      }
    };

    void bootstrapSession();
  }, [authUser?.id, sessions.length, isCreatingSession, createCoachSession]);

  const handleSend = async () => {
    const trimmed = draft.trim();
    if (!trimmed || !selectedSessionId) return;

    await sendCoachMessage(selectedSessionId, { content: trimmed });
    setDraft("");
  };

  const renderMessage = ({ item }: { item: any }) => {
    const messageText = typeof item?.content === "string" ? item.content : "";
    const isUser = item?.sender === "USER";

    return (
      <View
        style={[
          styles.messageRow,
          isUser ? styles.messageRowRight : styles.messageRowLeft,
        ]}
      >
        <View
          style={[styles.bubble, isUser ? styles.userBubble : styles.aiBubble]}
        >
          <Text style={[styles.messageText, isUser && styles.userText]}>
            {messageText}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 120}
      >
        <LinearGradient
          colors={[theme.primary, theme.primaryHover]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.heroCard}
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
              <Text style={styles.heroSubtitle}>
                {selectedSession?.title ?? "Motivasi latihan hari ini"}
              </Text>
            </View>

            <Pressable
              onPress={() => {
                void createCoachSession("Sesi baru AI Coach")
                  .then((newSession) => {
                    if (newSession?.id) {
                      setSelectedSessionId(newSession.id);
                    }
                  })
                  .catch((error) => {
                    console.warn("Failed to create AI Coach session:", error);
                  });
              }}
              style={styles.newChatButton}
              disabled={isCreatingSession}
            >
              {isCreatingSession ? (
                <ActivityIndicator size="small" color={theme.surface} />
              ) : (
                <MaterialCommunityIcons
                  name="plus"
                  size={18}
                  color={theme.surface}
                />
              )}
            </Pressable>
          </View>

          <View style={styles.statusRow}>
            <View style={styles.statusDot} />
            <Text style={styles.statusText}>Online and ready to coach</Text>
          </View>
        </LinearGradient>

        {sessions.length > 0 && (
          <View style={styles.sessionTabsWrap}>
            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              data={sessions}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.sessionTabs}
              renderItem={({ item }) => (
                <Pressable
                  onPress={() => setSelectedSessionId(item.id)}
                  style={[
                    styles.sessionTab,
                    item.id === selectedSessionId && styles.sessionTabActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.sessionTabText,
                      item.id === selectedSessionId &&
                        styles.sessionTabTextActive,
                    ]}
                    numberOfLines={1}
                  >
                    {item.title ?? "AI Coach"}
                  </Text>
                </Pressable>
              )}
            />
          </View>
        )}

        {isLoadingSessions || isLoadingMessages ? (
          <View style={styles.loadingWrap}>
            <ActivityIndicator size="large" color={theme.primary} />
          </View>
        ) : (
          <FlatList
            data={messages}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.chatList}
            renderItem={renderMessage}
            ListEmptyComponent={
              <View style={styles.emptyState}>
                <MaterialCommunityIcons
                  name="message-text-outline"
                  size={40}
                  color={theme.textHint}
                />
                <Text style={styles.emptyText}>Mulai chat dengan AI Coach</Text>
                <TypingIndicator />
              </View>
            }
          />
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
      marginTop: 12,
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
    heroSubtitle: {
      fontSize: 12,
      marginTop: 2,
      color: "rgba(255,255,255,0.8)",
    },
    newChatButton: {
      width: 40,
      height: 40,
      borderRadius: 12,
      backgroundColor: "rgba(255,255,255,0.18)",
      alignItems: "center",
      justifyContent: "center",
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
    sessionTabsWrap: {
      paddingVertical: 12,
      paddingHorizontal: 12,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
      backgroundColor: theme.surface,
    },
    sessionTabs: {
      gap: 10,
      paddingRight: 12,
    },
    sessionTab: {
      paddingHorizontal: 14,
      paddingVertical: 10,
      borderRadius: 999,
      backgroundColor: theme.elevated,
      borderWidth: 1,
      borderColor: theme.border,
      maxWidth: 200,
    },
    sessionTabActive: {
      backgroundColor: theme.primary,
      borderColor: theme.primary,
    },
    sessionTabText: {
      fontSize: 12,
      color: theme.text,
      fontWeight: "600",
    },
    sessionTabTextActive: {
      color: theme.surface,
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
    messageText: {
      fontSize: 14,
      lineHeight: 20,
      color: theme.text,
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
      paddingBottom: Platform.OS === "android" ? 18 : 12,
      marginBottom: Platform.OS === "android" ? 8 : 0,
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

const stylesTyping = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 14,
    backgroundColor: "rgba(108,63,255,0.08)",
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 999,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 999,
    backgroundColor: "#6C3FFF",
    opacity: 0.5,
  },
});
