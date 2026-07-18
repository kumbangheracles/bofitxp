import { Stack, Redirect } from "expo-router";
import { useAuth } from "@/context/AuthContext";
import AppPrivateLayout from "@/components/app-private-layout";
export default function PrivateLayout() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) return null;

  if (!isAuthenticated) {
    return <Redirect href="/public/login" />;
  }

  return (
    <AppPrivateLayout>
      <Stack screenOptions={{ headerShown: false }} />
    </AppPrivateLayout>
  );
}
