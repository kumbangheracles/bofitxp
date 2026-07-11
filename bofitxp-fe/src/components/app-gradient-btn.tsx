import { useAppTheme } from "@/hooks/use-app-theme";
import { LinearGradient } from "expo-linear-gradient";
import { ReactNode } from "react";
import {
  ActivityIndicator, // 1. Import ActivityIndicator untuk animasi loading
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
  isLoading?: boolean; // 2. Tambahkan prop isLoading opsional
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
  isLoading = false, // 3. Set default value ke false
  viewStyle,
  textStyle,
  variantGrad = "default",
  disabled, // Ambil disabled dari props bawaan jika ada
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

  // Tentukan warna spinner mengikuti warna teks agar kontras
  const spinnerColor = textStyle?.color || theme.textSecondary;

  return (
    <Pressable
      {...props}
      // 4. Otomatis disable tombol jika sedang loading ATAU jika prop disabled diset true
      disabled={disabled || isLoading}
      style={({ pressed }) => [
        { opacity: pressed || isLoading ? 0.7 : 1 }, // Beri efek feedback visual saat loading/ditekan
      ]}
    >
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
            alignItems: "center", // Pastikan spinner & teks sejajar vertikal
            gap: 8, // Beri jarak yang pas jika loading muncul
            padding: 12,
            ...viewStyle,
          }}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color={spinnerColor} />
          ) : (
            <>
              <Text
                style={{
                  textAlign: "center",
                  fontWeight: "700",
                  fontSize: 15.2,
                  color: theme.textSecondary,
                  ...textStyle,
                }}
              >
                {label}
              </Text>
              {icon}
            </>
          )}
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
            alignItems: "center", // Pastikan spinner & teks sejajar vertikal
            gap: 8,
            padding: 12,
            ...viewStyle,
          }}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color={spinnerColor} />
          ) : (
            <>
              <Text
                style={{
                  textAlign: "center",
                  fontWeight: "700",
                  fontSize: 15.2,
                  color: theme.textSecondary,
                  ...textStyle,
                }}
              >
                {label}
              </Text>
              {icon}
            </>
          )}
        </View>
      )}
    </Pressable>
  );
};

export default AppGradButton;
