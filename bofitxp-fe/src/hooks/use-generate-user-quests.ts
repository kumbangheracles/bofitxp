import { useAuth } from "@/context/AuthContext";
import { UserQuestService } from "@/services/userQuests.service";
import { QuestCategoryType } from "@/types/quests.type";
import { useState } from "react";
import Toast from "react-native-toast-message";
import useUserQuests from "./use-user-quests";
import { router } from "expo-router";

const useGenerateUserQuest = () => {
  const userQuestService = new UserQuestService();
  const [isLoading, setLoading] = useState<boolean>(false);
  const { authUser } = useAuth();
  const handleGenerateUserQuests = async (
    quest_category: QuestCategoryType,
  ) => {
    if (!authUser) {
      Toast.show({ type: "error", text1: "Invalid user id" });
      return;
    }

    console.log("Generated quest category: ", quest_category);

    try {
      setLoading(true);
      await userQuestService.generateQuests(quest_category);
      Toast.show({
        type: "success",
        text1: `Success generated ${quest_category} quests`,
      });
      return true;
    } catch (error: any) {
      console.error(error.message);
      Toast.show({
        type: "error",
        text1: `Error generated ${quest_category} quests`,
        text2: "Please try again later.",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };
  return { isLoading, setLoading, handleGenerateUserQuests };
};

export default useGenerateUserQuest;
