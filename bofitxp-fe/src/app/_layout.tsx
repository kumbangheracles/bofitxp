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

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const queryClient = new QueryClient();
  const toastConfig = useToastConfig();
  return (
    <AuthProvider>
      <GlobalSatateProvider>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider
            value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
          >
            <StyledProvider
              theme={colorScheme === "dark" ? DarkTheme : DefaultTheme}
            >
              <CustomToastProvider>
                <GlobalToastManager />
                <AnimatedSplashOverlay />
                <Stack screenOptions={{ headerShown: false }} />
                <Toast config={toastConfig} />
              </CustomToastProvider>
            </StyledProvider>
          </ThemeProvider>
        </QueryClientProvider>
      </GlobalSatateProvider>
    </AuthProvider>
  );
}
