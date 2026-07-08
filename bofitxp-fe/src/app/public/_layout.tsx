import "@/global.css";
import { Stack, Redirect, DarkTheme, DefaultTheme } from "expo-router";
import { useAuth } from "@/context/AuthContext";
import { ThemeProvider as StyledProvider } from "styled-components/native";
import { useColorScheme } from "react-native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
export default function PublicLayout() {
  const { isAuthenticated } = useAuth();
  const queryClient = new QueryClient();
  const colorScheme = useColorScheme();
  if (isAuthenticated) {
    return <Redirect href="/private/(tabs)" />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <StyledProvider theme={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <Stack screenOptions={{ headerShown: false }} />
      </StyledProvider>
    </QueryClientProvider>
  );
}
