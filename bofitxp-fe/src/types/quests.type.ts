export type QuestDifficulty = "easy" | "medium" | "hard";
export type QuestCategoryType = "daily" | "weekly" | "special" | null;
export enum QuestType {
  LIFTING = "lifting",
  CARDIO = "cardio",
  FLEXIBILITY = "flexibility",
  THINKING = "thinking",
}

export enum QuestCategory {
  DAILY = "daily",
  WEEKLY = "weekly",
  SPECIAL = "special",
}

export interface QuestsProperties {
  id: string;
  userId: string;
  questId: string;
  is_finished: boolean;
  finishedAt: Date;
  createdAt: Date;
  UpdateAt: Date;

  quest: {
    questId: string;
    title: string;
    quest_type: QuestType;
    difficulty: QuestDifficulty;
    quest_category: QuestCategory;
    xp_reward: number;
  };
}
