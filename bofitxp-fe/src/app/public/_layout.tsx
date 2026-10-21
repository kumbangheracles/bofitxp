import "@/global.css";
import { Stack, Redirect } from "expo-router";
import { useAuth } from "@/context/AuthContext";
export default function PublicLayout() {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Redirect href="/private/(tabs)/home" />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
