import { useColorScheme } from "react-native";
import { Colors, AppTheme } from "@/constants/theme";

export function useAppTheme(): AppTheme {
  const scheme = useColorScheme();
  return Colors[scheme === "dark" ? "dark" : "light"];
}
