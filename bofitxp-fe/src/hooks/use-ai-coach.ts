import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import aiCoachService from "@/services/aiCoach.service";
import {
  AiCoachMessage,
  AiCoachSession,
  AiCoachReminderProcessResultItem,
  SendAiCoachMessageRequest,
} from "@/types/aiCoach.type";

export const aiCoachQueryKeys = {
  sessions: ["ai-coach", "sessions"],
  sessionMessages: (sessionId: string) => ["ai-coach", "messages", sessionId],
};

const normalizeArray = <T>(value: T[] | null | undefined): T[] =>
  Array.isArray(value) ? value : [];

export const useAiCoachSessions = () => {
  const { authUser } = useAuth();

  return useQuery<AiCoachSession[]>({
    queryKey: aiCoachQueryKeys.sessions,
    queryFn: async () => {
      const sessions = await aiCoachService.getSessions();
      return normalizeArray(sessions);
    },
    enabled: !!authUser?.id,
  });
};

export const useAiCoachSessionMessages = (sessionId?: string) => {
  const { authUser } = useAuth();

  return useQuery<AiCoachMessage[]>({
    queryKey: sessionId
      ? aiCoachQueryKeys.sessionMessages(sessionId)
      : ["ai-coach", "messages", "none"],
    queryFn: async () => {
      if (!sessionId) {
        return [];
      }

      const messages = await aiCoachService.getSessionMessages(sessionId);
      return normalizeArray(messages);
    },
    enabled: !!authUser?.id && !!sessionId,
  });
};

export const useCreateAiCoachSession = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (title?: string) => aiCoachService.createSession({ title }),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: aiCoachQueryKeys.sessions,
      });
    },
  });
};

export const useSendAiCoachMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      sessionId,
      content,
    }: {
      sessionId: string;
      content: string;
    }) => aiCoachService.sendMessage(sessionId, { content }),
    onSuccess: (_, variables) => {
      void queryClient.invalidateQueries({
        queryKey: aiCoachQueryKeys.sessionMessages(variables.sessionId),
      });
      void queryClient.invalidateQueries({
        queryKey: aiCoachQueryKeys.sessions,
      });
    },
  });
};

export const useProcessAiCoachReminders = () => {
  return useMutation({
    mutationFn: () => aiCoachService.processReminders(),
  });
};

export const useAiCoachActions = () => {
  const { mutateAsync: createSession, isPending: isCreatingSession } =
    useCreateAiCoachSession();
  const { mutateAsync: sendMessage, isPending: isSendingMessage } =
    useSendAiCoachMessage();
  const { mutateAsync: processReminders, isPending: isProcessingReminders } =
    useProcessAiCoachReminders();

  const createCoachSession = useCallback(
    async (title?: string) => createSession(title),
    [createSession],
  );

  const sendCoachMessage = useCallback(
    async (sessionId: string, payload: SendAiCoachMessageRequest) =>
      sendMessage({ sessionId, content: payload.content }),
    [sendMessage],
  );

  const triggerCoachReminder = useCallback(
    async () => processReminders(),
    [processReminders],
  );

  return {
    createCoachSession,
    sendCoachMessage,
    triggerCoachReminder,
    isCreatingSession,
    isSendingMessage,
    isProcessingReminders,
  };
};

export type AiCoachReminderProcessResult = AiCoachReminderProcessResultItem[];

export default useAiCoachSessions;
