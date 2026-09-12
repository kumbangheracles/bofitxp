import { Difficulty } from "../../generated/prisma/enums";

export const XP_REWARD: Record<Difficulty, number> = {
  [Difficulty.easy]: 20,
  [Difficulty.medium]: 50,
  [Difficulty.hard]: 100,
};
export const getLevelThreshold = (level: number): number => {
  if (level <= 0) return 0;

  return Math.floor(100 * Math.pow(level, 1.35));
};
export const getQuestXpReward = (difficulty: "easy" | "medium" | "hard") => {
  return XP_REWARD[difficulty];
};
