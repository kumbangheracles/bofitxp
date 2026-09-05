import { useAuth } from "@/context/AuthContext";
import { UserQuestService } from "@/services/userQuests.service";
import { useQuery } from "@tanstack/react-query";

const useUserQuests = () => {
  const userQuestService = new UserQuestService();
  const { authUser } = useAuth();
  const { data, isError, isFetched, isPending, isSuccess, refetch, error } =
    useQuery({
      queryKey: ["userQuests", authUser?.id],
      queryFn: () => userQuestService.getAllUserQuests(authUser?.id as string),
      enabled: !!authUser?.id,
    });

  return { data, isError, isFetched, isPending, isSuccess, refetch, error };
};

export default useUserQuests;
