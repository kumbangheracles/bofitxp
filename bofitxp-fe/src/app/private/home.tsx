import AppActivationCodeCard from "@/components/app-activation-code-card";
import { useAppTheme } from "@/hooks/use-app-theme";
import { AuthService } from "@/services/auth.service";
import { UserProps } from "@/types/user.type";
import { useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, View } from "react-native";
import * as SecureStore from "expo-secure-store";
import { router } from "expo-router";
import AppGradButton from "@/components/app-gradient-btn";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { radius, spacing } from "@/constants/theme";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
const HomeScreen = () => {
  const theme = useAppTheme();
  const authService = new AuthService();
  const [code, setCode] = useState<UserProps["activationCode"]>("");
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState(false);
  const handleSubmit = async (type: "activation" | "resendActivationCode") => {
    setLoading(true);
    setError(undefined);
    try {
      const savedEmail = await SecureStore.getItemAsync("email_activation");
      if (!savedEmail) {
        alert(
          "Email aktivasi tidak ditemukan. Silakan lakukan registrasi ulang.",
        );
        return;
      }
      if (type === "activation") {
        const res = await authService.activationCode(
          code as UserProps["activationCode"],
        );
        if (res) {
          alert("Activation account success.");

          router.push("/public/login");
        }
      } else if (type === "resendActivationCode") {
        const res = await authService.resendActivationCode(savedEmail);
        if (res) {
          alert("Resend Activation code success.");
        }
      }
    } catch (error) {
      setError("Something went wrong.");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemedView>
      <ThemedText>Home Page</ThemedText>
    </ThemedView>
  );
};

export default HomeScreen;
