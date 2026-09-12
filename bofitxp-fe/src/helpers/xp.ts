export const getLevelThreshold = (level: number): number => {
  if (level <= 0) return 0;

  return Math.floor(100 * Math.pow(level, 1.35));
};
