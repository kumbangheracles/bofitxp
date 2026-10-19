import { StyleSheet, Text, View } from "react-native";
import {
  AppTheme,
  fontSize,
  fontWeight,
  radius,
  spacing,
} from "@/constants/theme";
type BmiColorKey = "danger" | "combo" | "comboSecondary" | "xp";
type BmiClassificationCardProps = {
  theme: AppTheme;
};
type BmiClassification = {
  label: string;
  range: string;
  description: string;
  colorKey: BmiColorKey;
};
const classifications: BmiClassification[] = [
  {
    label: "Severe thinness",
    range: "< 16.00",
    description:
      "BMI berada jauh di bawah rentang normal dan menunjukkan kondisi tubuh yang sangat kurus.",
    colorKey: "danger",
  },
  {
    label: "Moderate thinness",
    range: "16.00 – 16.99",
    description:
      "BMI menunjukkan kondisi tubuh yang cukup kurus dan berada di bawah rentang normal.",
    colorKey: "combo",
  },
  {
    label: "Mild thinness",
    range: "17.00 – 18.49",
    description: "BMI sedikit berada di bawah rentang normal.",
    colorKey: "comboSecondary",
  },
  {
    label: "Normal",
    range: "18.50 – 24.99",
    description:
      "BMI berada dalam rentang normal yang umumnya dikaitkan dengan berat badan yang sehat.",
    colorKey: "xp",
  },
  {
    label: "Pre-obesity",
    range: "25.00 – 29.99",
    description:
      "BMI berada di atas rentang normal dan menunjukkan berat badan berlebih.",
    colorKey: "comboSecondary",
  },
  {
    label: "Obesity Class I",
    range: "30.00 – 34.99",
    description: "BMI termasuk kategori obesitas tingkat pertama.",
    colorKey: "danger",
  },
  {
    label: "Obesity Class II",
    range: "35.00 – 39.99",
    description:
      "BMI termasuk kategori obesitas tingkat kedua dengan risiko kesehatan yang lebih tinggi.",
    colorKey: "danger",
  },
  {
    label: "Obesity Class III",
    range: "≥ 40.00",
    description:
      "BMI termasuk kategori obesitas tingkat ketiga dan memiliki risiko kesehatan yang lebih tinggi.",
    colorKey: "danger",
  },
];

const BmiClassificationCard = ({ theme }: BmiClassificationCardProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>
          BMI Classification
        </Text>

        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
          Understand your BMI category
        </Text>
      </View>

      <View style={styles.list}>
        {classifications.map((item) => {
          const color = theme[item.colorKey];

          return (
            <View
              key={item.label}
              style={[
                styles.card,
                {
                  backgroundColor: theme.surface,
                  borderColor: theme.border,
                },
              ]}
            >
              <View style={styles.topRow}>
                <View
                  style={[
                    styles.indicator,
                    {
                      backgroundColor: color,
                    },
                  ]}
                />

                <View style={styles.labelContainer}>
                  <Text
                    style={[
                      styles.label,
                      {
                        color: theme.text,
                      },
                    ]}
                  >
                    {item.label}
                  </Text>

                  <Text
                    style={[
                      styles.range,
                      {
                        color,
                      },
                    ]}
                  >
                    BMI {item.range}
                  </Text>
                </View>
              </View>

              <Text
                style={[
                  styles.description,
                  {
                    color: theme.textSecondary,
                  },
                ]}
              >
                {item.description}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
};

export default BmiClassificationCard;

const styles = StyleSheet.create({
  container: {
    gap: spacing.md,
  },

  header: {
    gap: spacing.xs,
  },

  title: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
  },

  subtitle: {
    fontSize: fontSize.sm,
  },

  list: {
    gap: spacing.sm,
  },

  card: {
    padding: spacing.md,
    borderWidth: 1,
    borderRadius: radius.md,
    gap: spacing.sm,
  },

  topRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },

  indicator: {
    width: 8,
    height: 8,
    borderRadius: radius.full,
  },

  labelContainer: {
    flex: 1,
    gap: 2,
  },

  label: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
  },

  range: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
  },

  description: {
    fontSize: fontSize.sm,
    lineHeight: 19,
  },
});
