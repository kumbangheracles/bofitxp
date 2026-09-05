import {
  spacing,
  fontWeight,
  fontSize,
  exerciseStyle,
  difficultyStyle,
} from "@/constants/theme";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Checkbox from "expo-checkbox";
import { useEffect, useState } from "react";
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useAppTheme } from "@/hooks/use-app-theme";
import { Pressable, Text, View } from "react-native";
import { useFadeInLeft } from "@/hooks/use-fadein-left";
import { QuestsProperties } from "@/types/quests.type";

interface QuestCardProps {
  item: QuestsProperties["quest"];
  index?: number;
  trigger?: string | number | boolean;
  showToast?: () => void;
}

const QuestCard = ({ item, index = 0, trigger, showToast }: QuestCardProps) => {
  const theme = useAppTheme();
  const [checked, setChecked] = useState<boolean>(false);
  const progress = useSharedValue(0);

  const { fadeInLeftStyle } = useFadeInLeft(trigger, index);

  useEffect(() => {
    progress.value = withTiming(checked ? 1 : 0, { duration: 50 });
  }, [checked]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      borderColor: interpolateColor(
        progress.value,
        [0, 1],
        [theme.elevated, theme.xpProgress],
      ),
    };
  });

  const quest = item;
  const questType = quest?.quest_type as keyof typeof exerciseStyle;
  const difficulty = quest?.difficulty as keyof typeof difficultyStyle;

  const exStyle = exerciseStyle[questType] ?? exerciseStyle.thinking;
  const difStyle = difficultyStyle[difficulty] ?? difficultyStyle.medium;

  return (
    <Animated.View style={fadeInLeftStyle}>
      <Pressable
        key={quest?.questId}
        onPress={() => {
          setChecked((prev) => !prev);
          showToast?.();
        }}
        style={{ gap: 8 }}
      >
        <Animated.View
          style={[
            {
              padding: spacing.md,
              backgroundColor: theme.surface,
              borderRadius: 16,
              marginTop: 12,
              borderWidth: 1,
              flexDirection: "row",
              gap: 8,
            },
            animatedStyle,
          ]}
        >
          <Checkbox
            style={{
              borderRadius: 16,
              padding: 10,
              borderColor: theme.textHint,
            }}
            value={checked}
            color={theme.xpProgress}
          />
          <View>
            <Text
              style={{
                fontSize: spacing.md,
                color: theme.text,
                textDecorationLine: checked ? "line-through" : "none",
                fontWeight: fontWeight.semibold,
              }}
            >
              {quest?.title}
            </Text>
            <View
              style={{
                flexDirection: "row",
                gap: 8,
                alignItems: "center",
                marginTop: 8,
              }}
            >
              {/* Quest type badge */}
              <View
                style={{
                  paddingBlock: 4,
                  paddingInline: 8,
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 4,
                  borderRadius: 16,
                  borderColor: exStyle.borderColor,
                  backgroundColor: exStyle.backgroundColor,
                  borderWidth: 1,
                }}
              >
                <MaterialCommunityIcons
                  name="fire"
                  color={exStyle.color}
                  size={fontSize.sm}
                />
                <Text style={{ fontSize: fontSize.xs, color: exStyle.color }}>
                  {questType}
                </Text>
              </View>

              {/* Difficulty badge */}
              <View
                style={{
                  paddingBlock: 4,
                  paddingInline: 8,
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 4,
                  borderRadius: 16,
                  borderColor: difStyle.borderColor,
                  backgroundColor: difStyle.backgroundColor,
                  borderWidth: 1,
                }}
              >
                <Text style={{ fontSize: fontSize.xs, color: difStyle.color }}>
                  {difficulty}
                </Text>
              </View>

              {/* XP badge */}
              <View
                style={{
                  paddingBlock: 4,
                  paddingInline: 8,
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 4,
                  borderRadius: 16,
                  backgroundColor: "#DCFCE7",
                  borderColor: "#BBF7D0",
                  borderWidth: 1,
                }}
              >
                <MaterialCommunityIcons
                  name="lightning-bolt-outline"
                  color={"#15803D"}
                  size={fontSize.sm}
                />
                <Text style={{ fontSize: fontSize.xs, color: "#15803D" }}>
                  +{quest?.xp_reward}XP
                </Text>
              </View>
            </View>
          </View>
        </Animated.View>
      </Pressable>
    </Animated.View>
  );
};

export default QuestCard;
