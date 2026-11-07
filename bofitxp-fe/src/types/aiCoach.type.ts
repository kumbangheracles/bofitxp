export type AiCoachMessageSender = "USER" | "AI";
export type AiCoachSessionStatus = "ACTIVE" | "CLOSED";
export type AiCoachReminderType =
  | "missed_quest"
  | "streak_warning"
  | "motivation"
  | "wellness_checkin";
export type AiCoachReminderStatus = "PENDING" | "SENT" | "READ" | "DISMISSED";

export interface AiCoachMessage {
  id: string;
  sessionId: string;
  sender: AiCoachMessageSender;
  content: string;
  createdAt: string;
}

export interface AiCoachSession {
  id: string;
  userId: string;
  title?: string | null;
  summary?: string | null;
  status: AiCoachSessionStatus;
  createdAt: string;
  updatedAt: string;
  messages?: AiCoachMessage[];
}

export interface AiCoachReminder {
  id: string;
  userId: string;
  sessionId?: string | null;
  type: AiCoachReminderType;
  title: string;
  body: string;
  status: AiCoachReminderStatus;
  scheduledAt: string;
  sentAt?: string | null;
  metadata?: Record<string, unknown> | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAiCoachSessionRequest {
  title?: string;
}

export interface SendAiCoachMessageRequest {
  content: string;
}

export interface ApiResponse<T> {
  message: string;
  data: T;
}

export interface AiCoachMessagePayload {
  userMessage: AiCoachMessage;
  aiMessage: AiCoachMessage;
}

export interface AiCoachReminderProcessResultItem {
  userId: string;
  sessionId?: string | null;
  reminder: AiCoachReminder;
}
