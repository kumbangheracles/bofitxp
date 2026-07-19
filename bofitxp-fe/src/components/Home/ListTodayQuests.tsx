import { fontSize, fontWeight, spacing } from "@/constants/theme";
import { useAppTheme } from "@/hooks/use-app-theme";
import { Pressable, Text, View, ToastAndroid } from "react-native";

import Checkbox from "expo-checkbox";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import Toast from "react-native-toast-message";
import { showError, showSuccess } from "@/utils/toast";
const ListTodayQuests = () => {
  const theme = useAppTheme();
  const [checked, setChecked] = useState<boolean>(false);
  const progress = useSharedValue(0);
  useEffect(() => {
    progress.value = withTiming(checked ? 1 : 0, {
      duration: 50,
    });
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

  const showToast = () => {
    showError("Workout selesai", "+120 XP");
  };

  return (
    <View style={{ width: "100%" }}>
      <View
        style={{
          marginBlock: 16,
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <Text
          style={{
            fontSize: fontSize.lg,
            fontWeight: fontWeight.bold,
            color: theme.text,
          }}
        >
          Today's Quests
        </Text>
        <Text
          style={{
            fontSize: fontSize.md,
            color: theme.primaryLabel,
            fontWeight: fontWeight.medium,
          }}
        >
          View All {">"}
        </Text>
      </View>

      {/* Quest Card */}
      <Pressable
        onPress={() => {
          (setChecked((prev) => !prev), showToast());
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
            // onValueChange={(val) => setChecked((val)=>!va)}
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
              Complete 3 sets of bench press
            </Text>
            <View
              style={{
                flexDirection: "row",
                gap: 8,
                alignItems: "center",
                marginTop: 8,
              }}
            >
              <View
                style={{
                  paddingBlock: 4,
                  paddingInline: 8,
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 4,
                  borderRadius: 16,
                  borderColor: theme.combo,
                  borderWidth: 1,
                }}
              >
                <MaterialCommunityIcons name="fire" color={theme.combo} />
                <Text style={{ fontSize: fontSize.xs, color: theme.combo }}>
                  Lifting
                </Text>
              </View>
              <View
                style={{
                  paddingBlock: 4,
                  paddingInline: 8,
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 4,
                  borderRadius: 16,
                  borderColor: theme.achievementGlow,
                  borderWidth: 1,
                }}
              >
                <Text
                  style={{
                    fontSize: fontSize.xs,
                    color: theme.achievementGlow,
                  }}
                >
                  Medium
                </Text>
              </View>
              <View
                style={{
                  paddingBlock: 4,
                  paddingInline: 8,
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 4,
                  borderRadius: 16,
                  borderColor: theme.xpProgress,
                  borderWidth: 1,
                }}
              >
                <MaterialCommunityIcons
                  name="lightning-bolt-outline"
                  color={theme.xpProgress}
                />
                <Text
                  style={{ fontSize: fontSize.xs, color: theme.xpProgress }}
                >
                  +80XP
                </Text>
              </View>
            </View>
          </View>
        </Animated.View>
      </Pressable>
    </View>
  );
};

export default ListTodayQuests;
