import { useAuth } from "@/context/AuthContext";
import { UserQuestService } from "@/services/userQuests.service";
import { useQuery } from "@tanstack/react-query";
import { QuestCategoryType } from "@/types/quests.type";
import { useEffect } from "react";

interface PropTypes {
  questCategory: QuestCategoryType;
}

const useUserQuests = ({ questCategory }: PropTypes) => {
  const userQuestService = new UserQuestService();
  const { authUser } = useAuth();
  const { data, isError, isFetched, isPending, isSuccess, refetch, error } =
    useQuery({
      queryKey: ["userQuests", authUser?.id, questCategory],
      queryFn: () => userQuestService.getAllUserQuests(questCategory),
      enabled: !!authUser?.id && !!questCategory,
    });

  useEffect(() => {
    console.log("Error userQuests: ", error);
  }, [error]);

  return { data, isError, isFetched, isPending, isSuccess, refetch, error };
};

export default useUserQuests;
