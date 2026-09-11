import { fontSize, fontWeight } from "@/constants/theme";
import { useAppTheme } from "@/hooks/use-app-theme";
import { ScrollView, Text, View } from "react-native";

import { useEffect, useState } from "react";
import { useSharedValue, withTiming } from "react-native-reanimated";
import { showSuccess } from "@/utils/toast";
import QuestCard from "../QuestCard";
import useUserQuests from "@/hooks/use-user-quests";
import { QuestCategory, QuestsProperties } from "@/types/quests.type";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Loader from "../ui/loaders";

const ListTodayQuests = () => {
  const theme = useAppTheme();
  const [checked, _] = useState<boolean>(false);
  const {
    data: dataQuests,
    isError,
    isFetched,
    isPending,
    refetch,
    error,
  } = useUserQuests({ questCategory: QuestCategory?.DAILY });

  useEffect(() => {
    console.log("Data quests: ", dataQuests);
  }, [dataQuests]);
  const progress = useSharedValue(0);
  useEffect(() => {
    progress.value = withTiming(checked ? 1 : 0, {
      duration: 50,
    });
  }, [checked]);

  // useEffect(() => {
  //   Toast.show({
  //     type: "error",
  //     text1: "Error get data quests",
  //     text2: error?.message,
  //   });
  // }, [error?.message !== undefined]);
  const showToast = (exp: number) => {
    showSuccess("Workout selesai", `+${exp} XP`);
  };

  return (
    <ScrollView style={{ width: "100%" }}>
      <View
        style={{
          marginBlock: 10,
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
      {isFetched && !isPending && dataQuests?.length === 0 && (
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
      {/* Quest List */}
      <View style={{ paddingBottom: 12 }}>
        {dataQuests?.map((item: QuestsProperties, index: number) => (
          <QuestCard
            refetch={refetch}
            key={item.id}
            item={item}
            index={index}
            showToast={() => showToast(item?.quest?.xp_reward)}
          />
        ))}
      </View>
    </ScrollView>
  );
};

export default ListTodayQuests;
