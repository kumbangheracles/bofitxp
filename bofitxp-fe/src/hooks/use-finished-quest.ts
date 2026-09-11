import { useAuth } from "@/context/AuthContext";
import { UserQuestService } from "@/services/userQuests.service";
import { Dispatch, SetStateAction, useState } from "react";
import Toast from "react-native-toast-message";
import useUserQuests from "./use-user-quests";

interface PropTypes {
  checked: boolean;
  setChecked: Dispatch<SetStateAction<boolean>>;
}

const useFinishedQuest = ({ checked, setChecked }: PropTypes) => {
  const { authUser } = useAuth();
  const userQuestService = new UserQuestService();
  const [loading, setLoading] = useState<boolean>(false);
  const handleFinishedQuest = async (
    userQuestId: string,
    questId: string,
    xp_reward: number,
  ) => {
    if (!authUser) {
      Toast.show({
        type: "error",
        text1: "Invalid user id",
      });

      return;
    }

    try {
      setLoading(true);
      console.log({ userQuestId, questId });
      const res = await userQuestService.finsihedQuest(userQuestId, questId);

      console.log("Res: ", res);
      setChecked(true);
      Toast.show({
        type: "success",
        text1: `Quest completed reward +${xp_reward} XP`,
      });
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: "Error update quest",
        text2: "Please try again later.",
      });
      console.log("Error finish quest: ", error.message);
      setChecked(false);
    } finally {
      setLoading(false);
    }
  };

  return { loading, handleFinishedQuest };
};

export default useFinishedQuest;
