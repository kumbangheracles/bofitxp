import { useAppTheme } from "@/hooks/use-app-theme";
import { useTheme } from "@/hooks/use-theme";
import { BaseToast, ErrorToast, ToastConfig } from "react-native-toast-message";

export const useToastConfig = (): ToastConfig => {
  const theme = useAppTheme(); // sesuaikan dengan shape dari hook use-theme kamu

  return {
    success: (props) => (
      <BaseToast
        {...props}
        style={{
          borderLeftColor: theme.xp, // neon teal - dipakai buat success/xp state
          borderRadius: 12,
          borderWidth: 1,
          borderColor: theme.border,
          backgroundColor: theme.elevated,
        }}
        contentContainerStyle={{
          paddingHorizontal: 12,
        }}
        text1Style={{
          fontSize: 16,
          fontWeight: "700",
          color: theme.text,
        }}
        text2Style={{
          fontSize: 14,
          color: theme.textSecondary,
        }}
      />
    ),

    error: (props) => (
      <ErrorToast
        {...props}
        style={{
          borderLeftColor: theme.danger,
          borderRadius: 12,
          borderWidth: 1,
          borderColor: theme.border,
          backgroundColor: theme.elevated,
        }}
        contentContainerStyle={{
          paddingHorizontal: 12,
        }}
        text1Style={{
          fontSize: 16,
          fontWeight: "700",
          color: theme.text,
        }}
        text2Style={{
          fontSize: 14,
          color: theme.textSecondary,
        }}
      />
    ),

    // bonus: achievement toast pake gold, cocok buat notif level-up/badge
    achievement: (props) => (
      <BaseToast
        {...props}
        style={{
          borderLeftColor: theme.achievement,
          borderRadius: 12,
          borderWidth: 1,
          borderColor: theme.border,
          backgroundColor: theme.elevated,
        }}
        text1Style={{
          fontSize: 16,
          fontWeight: "700",
          color: theme.text,
        }}
        text2Style={{
          fontSize: 14,
          color: theme.textSecondary,
        }}
      />
    ),
  };
};
