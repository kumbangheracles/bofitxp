import { Stack, Redirect } from "expo-router";
import { useAuth } from "@/context/AuthContext";
export default function PrivateLayout() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) return null;

  if (!isAuthenticated) {
    return <Redirect href="/public/login" />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
