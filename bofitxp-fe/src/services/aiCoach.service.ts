import instance from "@/utils/axios/instance";
import {
  AiCoachMessage,
  AiCoachMessagePayload,
  AiCoachReminderProcessResultItem,
  AiCoachSession,
  ApiResponse,
  CreateAiCoachSessionRequest,
  SendAiCoachMessageRequest,
} from "@/types/aiCoach.type";

export class AiCoachService {
  async createSession(payload?: CreateAiCoachSessionRequest) {
    const result = await instance.post<ApiResponse<AiCoachSession>>(
      "/ai-coach/sessions",
      payload ?? {},
    );

    return result.data.data;
  }

  async getSessions() {
    const result =
      await instance.get<ApiResponse<AiCoachSession[]>>("/ai-coach/sessions");

    return result.data.data;
  }

  async getSessionMessages(sessionId: string) {
    const result = await instance.get<ApiResponse<AiCoachMessage[]>>(
      `/ai-coach/sessions/${sessionId}/messages`,
    );

    return result.data.data;
  }

  async sendMessage(sessionId: string, payload: SendAiCoachMessageRequest) {
    const result = await instance.post<ApiResponse<AiCoachMessagePayload>>(
      `/ai-coach/sessions/${sessionId}/messages`,
      payload,
    );

    return result.data.data;
  }

  async processReminders() {
    const result = await instance.post<
      ApiResponse<AiCoachReminderProcessResultItem[]>
    >("/ai-coach/reminders/process");

    return result.data.data;
  }
}

export default new AiCoachService();
