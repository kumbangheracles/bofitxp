import AiCoachScreen from "@/app/private/ai-coach";
import { useAppTheme } from "@/hooks/use-app-theme";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  PanResponder,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

const BUBBLE_SIZE = 68;
const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

export default function AiCoachFloatingWidget() {
  const theme = useAppTheme();
  const [screenSize, setScreenSize] = useState(Dimensions.get("window"));
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [bubblePosition, setBubblePosition] = useState({
    x: Dimensions.get("window").width - BUBBLE_SIZE - 20,
    y: Dimensions.get("window").height - BUBBLE_SIZE - 110,
  });

  const bubblePositionRef = useRef(bubblePosition);
  const pan = useRef(
    new Animated.ValueXY({
      x: bubblePosition.x,
      y: bubblePosition.y,
    }),
  ).current;
  const panelAnimation = useRef(new Animated.Value(0)).current;

  const panelWidth = useMemo(
    () => Math.min(screenSize.width - 24, 380),
    [screenSize.width],
  );
  const panelHeight = useMemo(
    () => Math.min(screenSize.height * 0.72, 620),
    [screenSize.height],
  );

  useEffect(() => {
    bubblePositionRef.current = bubblePosition;
  }, [bubblePosition]);

  useEffect(() => {
    const handleResize = ({
      window,
    }: {
      window: { width: number; height: number };
    }) => {
      const nextX = clamp(
        bubblePositionRef.current.x,
        12,
        window.width - BUBBLE_SIZE - 12,
      );
      const nextY = clamp(
        bubblePositionRef.current.y,
        12,
        window.height - BUBBLE_SIZE - 12,
      );

      bubblePositionRef.current = { x: nextX, y: nextY };
      setBubblePosition({ x: nextX, y: nextY });
      pan.setValue({ x: nextX, y: nextY });
    };

    const subscription = Dimensions.addEventListener("change", handleResize);

    return () => {
      subscription?.remove?.();
    };
  }, [pan]);

  useEffect(() => {
    Animated.timing(panelAnimation, {
      toValue: isOpen && !isMinimized ? 1 : 0,
      duration: 220,
      useNativeDriver: true,
    }).start();
  }, [isOpen, isMinimized, panelAnimation]);

  const dragStartRef = useRef(bubblePosition);
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) =>
        Math.abs(gestureState.dx) > 4 || Math.abs(gestureState.dy) > 4,
      onPanResponderGrant: () => {
        dragStartRef.current = bubblePositionRef.current;
      },
      onPanResponderMove: (_, gestureState) => {
        const nextX = clamp(
          dragStartRef.current.x + gestureState.dx,
          12,
          screenSize.width - BUBBLE_SIZE - 12,
        );
        const nextY = clamp(
          dragStartRef.current.y + gestureState.dy,
          12,
          screenSize.height - BUBBLE_SIZE - 12,
        );

        const nextPosition = { x: nextX, y: nextY };
        bubblePositionRef.current = nextPosition;
        setBubblePosition(nextPosition);
        pan.setValue({ x: nextX, y: nextY });
      },
      onPanResponderRelease: () => {
        dragStartRef.current = bubblePositionRef.current;
      },
    }),
  ).current;

  const panelLeft = clamp(
    bubblePosition.x - panelWidth + BUBBLE_SIZE - 8,
    12,
    Math.max(12, screenSize.width - panelWidth - 12),
  );
  const panelTop = clamp(
    bubblePosition.y - panelHeight - 18,
    12,
    Math.max(12, screenSize.height - panelHeight - 22),
  );

  const handleToggleOpen = () => {
    setIsMinimized(false);
    setIsOpen((current) => !current);
  };

  const handleClose = () => {
    setIsMinimized(false);
    setIsOpen(false);
  };

  return (
    <>
      {isOpen && !isMinimized && (
        <Animated.View
          pointerEvents="box-none"
          style={[
            styles.panel,
            {
              width: panelWidth,
              height: panelHeight,
              left: panelLeft,
              top: panelTop,
              opacity: panelAnimation,
              transform: [
                {
                  translateY: panelAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [12, 0],
                  }),
                },
                {
                  scale: panelAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.96, 1],
                  }),
                },
              ],
            },
          ]}
        >
          <View
            style={[styles.panelHeader, { backgroundColor: theme.surface }]}
          >
            <View style={styles.panelTitleWrap}>
              <View
                style={[
                  styles.panelIcon,
                  { backgroundColor: theme.primaryMuted },
                ]}
              >
                <MaterialCommunityIcons
                  name="robot"
                  size={18}
                  color={theme.text}
                />
              </View>
              <Text style={[styles.panelTitle, { color: theme.text }]}>
                AI Coach
              </Text>
            </View>

            <View style={styles.panelActions}>
              <Pressable
                onPress={() => setIsMinimized((current) => !current)}
                style={[
                  styles.actionButton,
                  { backgroundColor: theme.elevated },
                ]}
              >
                <MaterialCommunityIcons
                  name={isMinimized ? "window-maximize" : "window-minimize"}
                  size={16}
                  color={theme.text}
                />
              </Pressable>
              <Pressable
                onPress={handleClose}
                style={[styles.actionButton, { backgroundColor: theme.danger }]}
              >
                <MaterialCommunityIcons
                  name="close"
                  size={16}
                  color={theme.textInverse}
                />
              </Pressable>
            </View>
          </View>

          <View
            style={[
              styles.chatPanelBody,
              { backgroundColor: theme.background },
            ]}
          >
            <AiCoachScreen />
          </View>
        </Animated.View>
      )}

      <Animated.View
        style={[
          styles.bubbleWrap,
          {
            transform: [{ translateX: pan.x }, { translateY: pan.y }],
          },
        ]}
        {...panResponder.panHandlers}
      >
        <View style={styles.tooltip} pointerEvents="none">
          <Text style={styles.tooltipText}>AI Coach</Text>
        </View>

        <Pressable
          accessibilityLabel="AI Coach"
          onPress={handleToggleOpen}
          style={({ pressed }) => [
            styles.bubble,
            {
              backgroundColor: theme.xp,
              shadowColor: theme.primary,
              shadowOpacity: pressed ? 0.28 : 0.18,
              shadowRadius: pressed ? 18 : 16,
              borderColor: `${theme.primary}CC`,
            },
            pressed && styles.bubblePressed,
          ]}
        >
          <MaterialCommunityIcons
            name="robot"
            size={28}
            color={theme.textInverse}
          />
        </Pressable>
      </Animated.View>
    </>
  );
}

const styles = StyleSheet.create({
  bubbleWrap: {
    position: "absolute",
    left: 0,
    top: 0,
    zIndex: 999,
  },
  tooltip: {
    position: "absolute",
    bottom: 78,
    right: -4,
    backgroundColor: "rgba(15, 23, 42, 0.9)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 6,
  },
  tooltipText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 0.2,
  },
  bubble: {
    width: BUBBLE_SIZE,
    height: BUBBLE_SIZE,
    borderRadius: BUBBLE_SIZE / 2,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    shadowOffset: { width: 0, height: 12 },
    shadowRadius: 20,
    elevation: 10,
  },
  bubblePressed: {
    transform: [{ scale: 0.98 }],
  },
  panel: {
    position: "absolute",
    zIndex: 998,
    borderRadius: 28,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(108, 63, 255, 0.15)",
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 18 },
    shadowOpacity: 0.18,
    shadowRadius: 28,
    elevation: 12,
  },
  panelHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(148, 163, 184, 0.18)",
  },
  panelTitleWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  panelIcon: {
    width: 30,
    height: 30,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  panelTitle: {
    fontSize: 15,
    fontWeight: "700",
  },
  panelActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  actionButton: {
    width: 28,
    height: 28,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
  },
  chatPanelBody: {
    flex: 1,
    overflow: "hidden",
  },
});
