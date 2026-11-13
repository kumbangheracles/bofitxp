import { useAuth } from "@/context/AuthContext";
import { useGlobalState } from "@/context/GlobalStateContext";
import { UserQuestService } from "@/services/userQuests.service";
import { QuestCategoryType } from "@/types/quests.type";
import { useState } from "react";
import Toast from "react-native-toast-message";
import i18n from "@/i18n";

const useGenerateUserQuest = () => {
  const userQuestService = new UserQuestService();
  const [isLoading, setLoading] = useState<boolean>(false);
  const { setIsOpenModalBmi } = useGlobalState();
  const { authUser } = useAuth();
  const handleGenerateUserQuests = async (
    quest_category: QuestCategoryType,
  ) => {
    if (!authUser) {
      Toast.show({ type: "error", text1: i18n.t("quests.invalidUser") });
      return;
    }

    if (authUser.body_mass_index === null) {
      Toast.show({
        type: "info",
        text1: i18n.t("quests.bmiRequired"),
        text2: i18n.t("quests.bmiRequiredHint"),
      });

      setIsOpenModalBmi(true);
      return;
    }

    console.log("Generated quest category: ", quest_category);

    try {
      setLoading(true);
      await userQuestService.generateQuests(quest_category);
      Toast.show({
        type: "success",
        text1: i18n.t("quests.generateSuccess", { category: quest_category }),
      });
      return true;
    } catch (error: any) {
      console.error(error.message);
      Toast.show({
        type: "error",
        text1: i18n.t("quests.generateError", { category: quest_category }),
        text2: i18n.t("validation.tryAgain"),
      });
      return false;
    } finally {
      setLoading(false);
    }
  };
  return { isLoading, setLoading, handleGenerateUserQuests };
};

export default useGenerateUserQuest;
