import { useAuth } from "@/context/AuthContext";
import { UserQuestService } from "@/services/userQuests.service";
import { Dispatch, SetStateAction, useRef, useState } from "react";
import Toast from "react-native-toast-message";

interface PropTypes {
  checked: boolean;
  setChecked: Dispatch<SetStateAction<boolean>>;
}

const useFinishedQuest = () => {
  const { authUser } = useAuth();
  const userQuestService = new UserQuestService();
  const [loading, setLoading] = useState<boolean>(false);
  const [checked, setChecked] = useState<boolean>(false);
  const inFlightRef = useRef(false); // guard sinkron, tidak nunggu render

  const handleFinishedQuest = async (
    id: string,
    questId: string,
    xp_reward: number,
  ) => {
    if (!authUser) {
      Toast.show({ type: "error", text1: "Invalid user id" });
      return;
    }

    // guard: sudah selesai atau masih ada request berjalan -> abaikan tap
    if (checked || inFlightRef.current) return;

    inFlightRef.current = true;
    setLoading(true);

    // optimistic update
    setChecked(true);
    try {
      await userQuestService.finsihedQuest(id, questId);
      console.log({ id, questId, xp_reward });
      console.log("SUCCESS - about to show toast");
      Toast.show({
        type: "success",
        text1: `Quest completed reward +${xp_reward} XP`,
      });
    } catch (error: any) {
      // rollback kalau gagal
      setChecked(false);
      Toast.show({
        type: "error",
        text1: "Error update quest",
        text2: "Please try again later.",
      });
      console.log("Error finish quest: ", error.message);
    } finally {
      setLoading(false);
      inFlightRef.current = false;
    }
  };

  return { loading, handleFinishedQuest, checked, setChecked };
};

export default useFinishedQuest;
