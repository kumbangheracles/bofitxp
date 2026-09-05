export type QuestDifficulty = "easy" | "medium" | "hard";
export enum QuestType {
  LIFTING = "lifting",
  CARDIO = "cardio",
  FLEXIBILITY = "flexibility",
  THINKING = "thinking",
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
    xp_reward: number;
  };
}
