import AppGradButton from "@/components/app-gradient-btn";
import QuestCard from "@/components/QuestCard";
import AnimatedTabButton from "@/components/Quests/AnimatedTabButton";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Text } from "react-native";
import Loader from "@/components/ui/loaders";
import {
  difficultyStyle,
  exerciseStyle,
  fontWeight,
  spacing,
} from "@/constants/theme";
import { useAppTheme } from "@/hooks/use-app-theme";
import { useFadeInLeft } from "@/hooks/use-fadein-left";
import useGenerateUserQuest from "@/hooks/use-generate-user-quests";
import useUserQuests from "@/hooks/use-user-quests";
import {
  QuestCategory,
  QuestCategoryType,
  QuestsProperties,
} from "@/types/quests.type";
import { showSuccess } from "@/utils/toast";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ComponentProps, useEffect } from "react";
import { View, ScrollView } from "react-native";

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
  const activeTab: QuestCategoryType =
    params.tab === QuestCategory.WEEKLY
      ? QuestCategory.WEEKLY
      : params.tab === QuestCategory.SPECIAL
        ? QuestCategory.SPECIAL
        : QuestCategory.DAILY;
  const questCat: QuestCategoryTab[] = [
    { id: 1, key: QuestCategory.DAILY, title: "Daily", iconName: "calendar" },
    { id: 2, key: QuestCategory.WEEKLY, title: "Weekly", iconName: "recycle" },
    { id: 3, key: QuestCategory.SPECIAL, title: "Special", iconName: "trophy" },
  ];

  useEffect(() => {
    console.log("Active tab: ", activeTab);
  }, [activeTab]);

  const {
    handleGenerateUserQuests,
    isLoading: loadingGenerate,
    setLoading: setLoadingGenerate,
  } = useGenerateUserQuest();

  const {
    data: listQuests,
    isPending,
    isFetched,
    refetch,
    error,
  } = useUserQuests({
    questCategory: activeTab,
  });

  const mockQuestsDaily = [
    {
      id: 1,
      title: "Complete 3 sets of bench press",
      exercise: "Lifting",
      difficulity: "Medium",
      exp: 80,
      exStyle: exerciseStyle["lifting"],
      difStyle: difficultyStyle["medium"],
    },
    {
      id: 2,
      title: "Run 3 kilometers",
      exercise: "Cardio",
      difficulity: "Hard",
      exp: 150,
      exStyle: exerciseStyle["cardio"],
      difStyle: difficultyStyle["hard"],
    },
    {
      id: 3,
      title: "Complete 20 push-ups",
      exercise: "Lifting",
      difficulity: "Easy",
      exp: 60,
      exStyle: exerciseStyle["lifting"],
      difStyle: difficultyStyle["easy"],
    },
    {
      id: 4,
      title: "Morning walk for 30 minutes",
      exercise: "Cardio",
      difficulity: "Easy",
      exp: 70,
      exStyle: exerciseStyle["cardio"],
      difStyle: difficultyStyle["easy"],
    },
    {
      id: 5,
      title: "Read a book for 30 minutes",
      exercise: "Thinking",
      difficulity: "Easy",
      exp: 50,
      exStyle: exerciseStyle["thinking"],
      difStyle: difficultyStyle["easy"],
    },
    {
      id: 6,
      title: "Complete 4 sets of squats",
      exercise: "Lifting",
      difficulity: "Hard",
      exp: 180,
      exStyle: exerciseStyle["lifting"],
      difStyle: difficultyStyle["hard"],
    },
    {
      id: 7,
      title: "Cycle for 45 minutes",
      exercise: "Cardio",
      difficulity: "Medium",
      exp: 110,
      exStyle: exerciseStyle["cardio"],
      difStyle: difficultyStyle["medium"],
    },
    {
      id: 8,
      title: "Solve 5 logic puzzles",
      exercise: "Thinking",
      difficulity: "Medium",
      exp: 100,
      exStyle: exerciseStyle["thinking"],
      difStyle: difficultyStyle["medium"],
    },
    {
      id: 9,
      title: "Complete 3 sets of shoulder press",
      exercise: "Lifting",
      difficulity: "Medium",
      exp: 90,
      exStyle: exerciseStyle["lifting"],
      difStyle: difficultyStyle["medium"],
    },
    {
      id: 10,
      title: "Meditate for 20 minutes",
      exercise: "Thinking",
      difficulity: "Easy",
      exp: 65,
      exStyle: exerciseStyle["thinking"],
      difStyle: difficultyStyle["easy"],
    },
  ];

  const mockQuestWeekly = [
    {
      id: 1,
      title: "Complete 5 workout sessions",
      exercise: "Lifting",
      difficulity: "Medium",
      exp: 300,
      exStyle: exerciseStyle["lifting"],
      difStyle: difficultyStyle["medium"],
    },
    {
      id: 2,
      title: "Run a total of 15 kilometers",
      exercise: "Cardio",
      difficulity: "Hard",
      exp: 450,
      exStyle: exerciseStyle["cardio"],
      difStyle: difficultyStyle["hard"],
    },
    {
      id: 3,
      title: "Complete 100 push-ups",
      exercise: "Lifting",
      difficulity: "Hard",
      exp: 400,
      exStyle: exerciseStyle["lifting"],
      difStyle: difficultyStyle["hard"],
    },
    {
      id: 4,
      title: "Walk for 3 hours this week",
      exercise: "Cardio",
      difficulity: "Medium",
      exp: 250,
      exStyle: exerciseStyle["cardio"],
      difStyle: difficultyStyle["medium"],
    },
    {
      id: 5,
      title: "Read for 3 hours this week",
      exercise: "Thinking",
      difficulity: "Easy",
      exp: 200,
      exStyle: exerciseStyle["thinking"],
      difStyle: difficultyStyle["easy"],
    },
    {
      id: 6,
      title: "Complete 50 squats",
      exercise: "Lifting",
      difficulity: "Easy",
      exp: 180,
      exStyle: exerciseStyle["lifting"],
      difStyle: difficultyStyle["easy"],
    },
    {
      id: 7,
      title: "Cycle for 2 hours this week",
      exercise: "Cardio",
      difficulity: "Medium",
      exp: 280,
      exStyle: exerciseStyle["cardio"],
      difStyle: difficultyStyle["medium"],
    },
  ];

  const mockQuestSpecial = [
    {
      id: 1,
      title: "Complete a full body workout",
      exercise: "Lifting",
      difficulity: "Hard",
      exp: 500,
      exStyle: exerciseStyle["lifting"],
      difStyle: difficultyStyle["hard"],
    },
    {
      id: 2,
      title: "Run 10 kilometers in one session",
      exercise: "Cardio",
      difficulity: "Hard",
      exp: 600,
      exStyle: exerciseStyle["cardio"],
      difStyle: difficultyStyle["hard"],
    },
    {
      id: 3,
      title: "Complete 200 push-ups",
      exercise: "Lifting",
      difficulity: "Hard",
      exp: 550,
      exStyle: exerciseStyle["lifting"],
      difStyle: difficultyStyle["hard"],
    },
    {
      id: 4,
      title: "Finish a 60-minute cycling session",
      exercise: "Cardio",
      difficulity: "Medium",
      exp: 350,
      exStyle: exerciseStyle["cardio"],
      difStyle: difficultyStyle["medium"],
    },
    {
      id: 5,
      title: "Read an entire book",
      exercise: "Thinking",
      difficulity: "Hard",
      exp: 500,
      exStyle: exerciseStyle["thinking"],
      difStyle: difficultyStyle["hard"],
    },
    {
      id: 6,
      title: "Meditate for 60 minutes",
      exercise: "Thinking",
      difficulity: "Medium",
      exp: 300,
      exStyle: exerciseStyle["thinking"],
      difStyle: difficultyStyle["medium"],
    },
    {
      id: 7,
      title: "Complete 100 squats",
      exercise: "Lifting",
      difficulity: "Medium",
      exp: 350,
      exStyle: exerciseStyle["lifting"],
      difStyle: difficultyStyle["medium"],
    },
  ];

  const showToast = (exp: number) => {
    showSuccess("Workout selesai", `+${exp} XP`);
  };

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

      <View
        style={{
          justifyContent: "center",
          width: "100%",
          alignItems: "center",
          marginTop: 10,
        }}
      >
        <AppGradButton
          isGrad
          icon={
            <MaterialCommunityIcons size={13} name="star" color={theme.text} />
          }
          isLoading={loadingGenerate}
          onPress={async () => {
            const success = await handleGenerateUserQuests(activeTab);
            if (success) refetch();
          }}
          variantGrad="primary"
          viewStyle={{ width: 310, padding: 16 }}
          label={"Generate AI Quests"}
          title={""}
        />

        <ThemedText style={{ fontSize: 10, color: theme.textHint }}>
          AI will create personalized quests based on your fitness level
        </ThemedText>
      </View>

      <View style={{ marginTop: 10, marginInline: 8 }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <ThemedText style={{ fontSize: 14 }}>
            This Week's Challenges
          </ThemedText>
          <ThemedText
            style={{
              fontSize: 14,
              fontWeight: fontWeight.regular,
              color: theme.textHint,
            }}
          >
            0/2 Completed
          </ThemedText>
        </View>

        {/* Loading */}
        {isPending && (
          <View
            style={{
              padding: 20,
              borderRadius: 16,
              backgroundColor: theme.background,
              justifyContent: "center",
              alignItems: "center",
              gap: 4,
            }}
          >
            <Loader />
          </View>
        )}

        {/* Empty */}
        {isFetched && !isPending && listQuests?.length === 0 && (
          <View
            style={{
              padding: 20,
              borderRadius: 16,
              borderColor: theme.textHint,
              borderWidth: 1,
              backgroundColor: theme.background,
              justifyContent: "center",
              alignItems: "center",
              gap: 4,
            }}
          >
            <MaterialCommunityIcons
              color={theme.textHint}
              name="database-off"
              size={24}
            />
            <Text style={{ color: theme.textHint }}>No quests available</Text>
          </View>
        )}

        {/* List Quests */}

        {activeTab === "daily" &&
          listQuests?.map((item: QuestsProperties, index: number) => {
            return <QuestCard key={item.id} item={item} index={index} />;
          })}

        {activeTab === "weekly" &&
          listQuests?.map((item: QuestsProperties, index: number) => {
            return <QuestCard key={item.id} item={item} index={index} />;
          })}

        {activeTab === "special" &&
          listQuests?.map((item: QuestsProperties, index: number) => {
            return <QuestCard key={item.id} item={item} index={index} />;
          })}
      </View>
    </ScrollView>
  );
};

export default QuestsPage;
