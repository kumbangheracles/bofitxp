import {
  difficultyStyle,
  exerciseStyle,
  fontSize,
  fontWeight,
} from "@/constants/theme";
import { useAppTheme } from "@/hooks/use-app-theme";
import { ScrollView, Text, View } from "react-native";

import { useEffect, useState } from "react";
import { useSharedValue, withTiming } from "react-native-reanimated";
import { showSuccess } from "@/utils/toast";
import QuestCard from "../QuestCard";

const mockQuests = [
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
    title: "Mukbang matcha",
    exercise: "Cardio",
    difficulity: "Hard",
    exp: 190,
    exStyle: exerciseStyle["cardio"],
    difStyle: difficultyStyle["hard"],
  },
  {
    id: 3,
    title: "Mukbang Gorengan",
    exercise: "Cardio",
    difficulity: "Medium",
    exp: 120,
    exStyle: exerciseStyle["cardio"],
    difStyle: difficultyStyle["medium"],
  },
  {
    id: 4,
    title: "Jalan jalan pagi",
    exercise: "Cardio",
    difficulity: "Easy",
    exp: 80,
    exStyle: exerciseStyle["cardio"],
    difStyle: difficultyStyle["easy"],
  },
  {
    id: 5,
    title: "Read Book",
    exercise: "Thinking",
    difficulity: "Easy",
    exp: 70,
    exStyle: exerciseStyle["thinking"],
    difStyle: difficultyStyle["easy"],
  },
];

const ListTodayQuests = () => {
  const theme = useAppTheme();
  const [checked, _] = useState<boolean>(false);

  const progress = useSharedValue(0);
  useEffect(() => {
    progress.value = withTiming(checked ? 1 : 0, {
      duration: 50,
    });
  }, [checked]);

  const showToast = (exp: number) => {
    showSuccess("Workout selesai", `+${exp} XP`);
  };

  return (
    <ScrollView style={{ width: "100%" }}>
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

      {/* List Quest Card */}
      {mockQuests?.map((item, index) => (
        <QuestCard
          key={item.id}
          item={item}
          index={index}
          showToast={() => showToast(item.exp)}
        />
      ))}
    </ScrollView>
  );
};

export default ListTodayQuests;
