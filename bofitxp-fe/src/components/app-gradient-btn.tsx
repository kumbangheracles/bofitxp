import { useAppTheme } from "@/hooks/use-app-theme";
import { LinearGradient } from "expo-linear-gradient";
import { ReactNode } from "react";
import {
  ButtonProps,
  Pressable,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";

interface PropTypes extends ButtonProps {
  label: string;
  icon?: ReactNode;
  isGrad?: boolean;
  startGrad?: { x: number; y: number };
  endGrad?: { x: number; y: number };
  viewStyle?: ViewStyle;
  textStyle?: TextStyle;
  variantGrad?:
    | "default"
    | "combo"
    | "primary"
    | "secondary"
    | "danger"
    | "warning"
    | "success";
}

const AppGradButton = ({
  label,
  icon,
  startGrad = { x: 0, y: 0 },
  endGrad = { x: 1, y: 1 },
  isGrad = false,
  viewStyle,
  textStyle,
  variantGrad = "default",
  ...props
}: PropTypes) => {
  const theme = useAppTheme();

  const gradColors = {
    default: [theme.surface, theme.surface, theme.surface],
    combo: [
      theme.combo,
      theme.combo,
      theme.comboSecondary,
      theme.comboSecondary,
    ],
    primary: [theme.primary, theme.primaryHover, theme.primaryLabel],
    secondary: [
      theme.textHint,
      theme.textHint,
      theme.textSecondary,
      theme.textSecondary,
    ],
    danger: [theme.danger, theme.danger, theme.danger],
    success: [theme.xp, theme.xp, theme.xpProgress, theme.xpProgress],
    warning: [
      theme.achievement,
      theme.achievement,
      theme.achievementGlow,
      theme.achievementGlow,
    ],
  }[variantGrad];

  return (
    <Pressable {...props}>
      {isGrad ? (
        <LinearGradient
          colors={gradColors as any}
          start={startGrad}
          end={endGrad}
          style={{
            marginTop: 8,
            borderRadius: 16,
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            gap: 4,
            padding: 12,
            ...viewStyle,
          }}
        >
          <Text
            style={{
              textAlign: "center",
              fontWeight: 700,
              fontSize: 15.2,
              color: theme.textSecondary,
              ...textStyle,
            }}
          >
            {label}
          </Text>
          {icon}
        </LinearGradient>
      ) : (
        <View
          style={{
            marginTop: 8,
            borderRadius: 16,
            overflow: "hidden",
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            gap: 4,
            padding: 12,
            ...viewStyle,
          }}
        >
          <Text
            style={{
              textAlign: "center",
              fontWeight: 700,
              fontSize: 15.2,
              color: theme.textSecondary,
              ...textStyle,
            }}
          >
            {label}
          </Text>
          {icon}
        </View>
      )}
    </Pressable>
  );
};

export default AppGradButton;
