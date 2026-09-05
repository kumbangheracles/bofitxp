import { useAuth } from "@/context/AuthContext";
import { UserQuestService } from "@/services/userQuests.service";
import { useQuery } from "@tanstack/react-query";

const useGenerateUserQuests = () => {
  const userQuestService = new UserQuestService();
  const { authUser } = useAuth();
  const { data, isError, isFetched, isPending, isSuccess, refetch } = useQuery({
    queryKey: ["userQuests", authUser?.id],
    queryFn: () => userQuestService.generateQuests(authUser?.id as string),
    enabled: !!authUser?.id,
  });

  return { data, isError, isFetched, isPending, isSuccess, refetch };
};

export default useGenerateUserQuests;
