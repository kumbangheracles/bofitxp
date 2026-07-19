import { fontSize, fontWeight, spacing } from "@/constants/theme";
import { useAppTheme } from "@/hooks/use-app-theme";
import { Text, View } from "react-native";
import Checkbox from "expo-checkbox";
import { MaterialCommunityIcons } from "@expo/vector-icons";
const ListTodayQuests = () => {
  const theme = useAppTheme();
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

      <View style={{ gap: 8 }}>
        <View
          style={{
            padding: spacing.md,
            backgroundColor: theme.surface,
            borderRadius: 16,
            marginTop: 12,
            borderWidth: 1,
            overflowX: "hidden",
            borderColor: theme.elevated,
            flexDirection: "row",
            gap: 8,
          }}
        >
          <Checkbox
            style={{
              borderRadius: 16,
              padding: 10,
              borderColor: theme.textHint,
            }}
            value={true}
            color={theme.xpProgress}
            onValueChange={() => {}}
          />
          <View>
            <Text
              style={{
                fontSize: spacing.md,
                color: theme.text,
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
        </View>
      </View>
    </View>
  );
};

export default ListTodayQuests;
