import "@/global.css";
import Toast from "react-native-toast-message";
import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from "expo-router";
import { useColorScheme } from "react-native";
import { AnimatedSplashOverlay } from "@/components/animated-icon";
import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider as StyledProvider } from "styled-components/native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useToastConfig } from "@/components/app-toast";
import GlobalToastManager from "@/components/CustomToastManager";
import { CustomToastProvider } from "@/context/CostumToastProvider";
import { GlobalSatateProvider } from "@/context/GlobalStateContext";
import { Colors } from "@/constants/theme";
import BmiModal from "@/components/BmiModal";

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const queryClient = new QueryClient();
  const toastConfig = useToastConfig();
  const appTheme = Colors[colorScheme === "dark" ? "dark" : "light"];

  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <GlobalSatateProvider>
          <ThemeProvider
            value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
          >
            <StyledProvider theme={appTheme}>
              <CustomToastProvider>
                <GlobalToastManager />
                <AnimatedSplashOverlay />
                <Stack screenOptions={{ headerShown: false }} />
                <Toast config={toastConfig} />
                <BmiModal />
              </CustomToastProvider>
            </StyledProvider>
          </ThemeProvider>
        </GlobalSatateProvider>
      </QueryClientProvider>
    </AuthProvider>
  );
}
