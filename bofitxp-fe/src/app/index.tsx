import { useAuth } from "@/context/AuthContext";
import { Redirect } from "expo-router";

export default function Index() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) return null; // atau loading screen

  return isAuthenticated ? (
    <Redirect href="/private/(tabs)/home" />
  ) : (
    <Redirect href="/public/login" />
  );
}
