import { AppTheme } from "@/constants/theme";

export type BmiCategoryKey =
  | "notCalculated"
  | "underweight"
  | "normal"
  | "overweight"
  | "obesity";

type BmiCategory = {
  key: BmiCategoryKey;
  color: string;
  backgroundColor: string;
  borderColor: string;
};

const getBmiCategory = (
  bmi: number | null | undefined,
  theme: AppTheme,
): BmiCategory => {
  if (bmi == null) {
    return {
      key: "notCalculated",
      color: theme.textSecondary,
      backgroundColor: theme.elevated,
      borderColor: theme.border,
    };
  }

  if (bmi < 18.5) {
    return {
      key: "underweight",
      color: theme.combo,
      backgroundColor: `${theme.combo}20`,
      borderColor: `${theme.combo}40`,
    };
  }

  if (bmi < 25) {
    return {
      key: "normal",
      color: theme.xp,
      backgroundColor: `${theme.xp}20`,
      borderColor: `${theme.xp}40`,
    };
  }

  if (bmi < 30) {
    return {
      key: "overweight",
      color: theme.comboSecondary,
      backgroundColor: `${theme.comboSecondary}20`,
      borderColor: `${theme.comboSecondary}40`,
    };
  }

  return {
    key: "obesity",
    color: theme.danger,
    backgroundColor: `${theme.danger}20`,
    borderColor: `${theme.danger}40`,
  };
};
export { getBmiCategory };
