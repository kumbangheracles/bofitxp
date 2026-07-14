import "@/global.css";
import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from "expo-router";
import { useColorScheme } from "react-native";
import { AnimatedSplashOverlay } from "@/components/animated-icon";
import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider as StyledProvider } from "styled-components/native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const queryClient = new QueryClient();
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider
          value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
        >
          <StyledProvider
            theme={colorScheme === "dark" ? DarkTheme : DefaultTheme}
          >
            <AnimatedSplashOverlay />
            <Stack screenOptions={{ headerShown: false }} />
          </StyledProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </AuthProvider>
  );
}
