import { AppTheme } from "@/constants/theme";

type BmiCategory = {
  label: string;
  color: string;
  backgroundColor: string;
};

const getBmiCategory = (bmi: number | null | undefined, theme: AppTheme) => {
  if (bmi == null) {
    return {
      label: "Not calculated",
      color: theme.textSecondary,
      backgroundColor: theme.elevated,
      borderColor: theme.border,
    };
  }

  if (bmi < 18.5) {
    return {
      label: "Underweight",
      color: theme.combo,
      backgroundColor: `${theme.combo}20`,
      borderColor: `${theme.combo}40`,
    };
  }

  if (bmi < 25) {
    return {
      label: "Normal",
      color: theme.xp,
      backgroundColor: `${theme.xp}20`,
      borderColor: `${theme.xp}40`,
    };
  }

  if (bmi < 30) {
    return {
      label: "Overweight",
      color: theme.comboSecondary,
      backgroundColor: `${theme.comboSecondary}20`,
      borderColor: `${theme.comboSecondary}40`,
    };
  }

  return {
    label: "Obesity",
    color: theme.danger,
    backgroundColor: `${theme.danger}20`,
    borderColor: `${theme.danger}40`,
  };
};
export { getBmiCategory };
