import AppGradButton from "@/components/app-gradient-btn";
import AnimatedTabButton from "@/components/Quests/AnimatedTabButton";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { spacing } from "@/constants/theme";
import { useAppTheme } from "@/hooks/use-app-theme";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ComponentProps } from "react";
import { View, ScrollView, Pressable } from "react-native";

export interface QuestCategoryTab {
  id: number;
  key: string;
  title: string;
  iconName: ComponentProps<typeof MaterialCommunityIcons>["name"];
}

const QuestsPage = () => {
  const theme = useAppTheme();
  const router = useRouter();

  const params = useLocalSearchParams<{ tab?: string }>();
  const activeTab = params.tab || "daily";

  const questCat: QuestCategoryTab[] = [
    { id: 1, key: "daily", title: "Daily", iconName: "calendar" },
    { id: 2, key: "weekly", title: "Weekly", iconName: "recycle" },
    { id: 3, key: "special", title: "Special", iconName: "trophy" },
  ];
  return (
    <ScrollView>
      <ThemedView
        style={{
          paddingInline: spacing.md,
          paddingTop: 50,
          paddingBottom: 20,
          backgroundColor: theme.elevated,
        }}
      >
        <View>
          <ThemedText>Quest Hub</ThemedText>
          <ThemedText style={{ fontWeight: 300, color: theme.textHint }}>
            Your daily challenges
          </ThemedText>

          <ThemedView
            style={{
              flexDirection: "row",
              gap: spacing.sm,
              width: "100%",
              justifyContent: "center",
              alignItems: "center",
              marginTop: 20,
              paddingInline: 5,
              backgroundColor: theme.elevated,
            }}
          >
            {questCat?.map((item) => {
              const isActive = activeTab === item.key;

              return (
                <AnimatedTabButton
                  key={item.id}
                  item={item}
                  isActive={isActive}
                  theme={theme}
                  spacing={spacing}
                  onPress={() => {
                    router.setParams({ tab: item.key });
                  }}
                />
              );
            })}
          </ThemedView>
        </View>
      </ThemedView>

      <ThemedView
        style={{
          justifyContent: "center",
          width: "100%",
          alignItems: "center",
        }}
      >
        <AppGradButton
          isGrad
          icon={
            <MaterialCommunityIcons size={13} name="star" color={theme.text} />
          }
          variantGrad="primary"
          viewStyle={{ width: 310, padding: 16 }}
          label={"Generate AI Quests"}
          title={""}
        />
      </ThemedView>
    </ScrollView>
  );
};

export default QuestsPage;
