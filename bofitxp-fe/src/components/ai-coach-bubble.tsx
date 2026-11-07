import { useAppTheme } from "@/hooks/use-app-theme";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import {
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from "react-native";

type AiCoachBubbleProps = {
  label?: string;
  style?: StyleProp<ViewStyle>;
  compact?: boolean;
  onPress?: () => void;
  onPressIn?: () => void;
  onPressOut?: () => void;
};

export default function AiCoachBubble({
  label = "AI Coach",
  style,
  compact = false,
  onPress,
  onPressIn,
  onPressOut,
}: AiCoachBubbleProps) {
  const theme = useAppTheme();

  return (
    <Pressable
      onPress={() => {
        if (onPress) {
          onPress();
          return;
        }

        router.push("/private/ai-coach");
      }}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      style={[styles.wrapper, compact && styles.compact, style]}
    >
      <View style={styles.buttonInner}>
        <MaterialCommunityIcons
          name="robot"
          size={compact ? 18 : 20}
          color={theme.text}
        />
        {!compact && <Text style={styles.label}>{label}</Text>}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: "#2EEFC7",
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#2EEFC7",
    paddingHorizontal: 14,
    paddingVertical: 10,
    alignSelf: "center",
  },
  compact: {
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  buttonInner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    color: "#111827",
  },
  label: {
    color: "#111827",
    fontWeight: "600",
    fontSize: 13,
  },
});
