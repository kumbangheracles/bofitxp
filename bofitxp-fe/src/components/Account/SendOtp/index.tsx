import { useAuth } from "@/context/AuthContext";
import { useAppTheme } from "@/hooks/use-app-theme";
import { AuthService } from "@/services/auth.service";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { KeyboardAvoidingView, ScrollView, View } from "react-native";
import { Platform } from "react-native";
import Toast from "react-native-toast-message";
type KeyParams = "password" | "email";

const SendOtpIndex = () => {
  const { key } = useLocalSearchParams<{ key: KeyParams }>();
  const { authUser } = useAuth();
  const theme = useAppTheme();
  const authService = new AuthService();
  const [code, setCode] = useState<string>("");
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (type: "activation" | "resendActivationCode") => {
    setLoading(true);
    setError(undefined);
    try {
      const savedEmail = authUser?.email;
      if (!savedEmail) {
        Toast.show({
          type: "error",
          text1: "Email tidak valid. Silakan lakukan registrasi ulang.",
        });
        return;
      }
      if (type === "activation") {
        const res = await authService.activationCode(code);
        if (res) {
          Toast.show({
            type: "success",
            text1: "Activation account success.",
          });
          router.push("/public/login");
        }
      } else if (type === "resendActivationCode") {
        const res = await authService.resendActivationCode(savedEmail);
        if (res) {
          Toast.show({
            type: "success",
            text1: "Resend Activation code success.",
          });
        }
      }
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Something went wrong.",
      });
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      {key === "password" && <ScrollView></ScrollView>}
      {key === "email" && <ScrollView></ScrollView>}
    </KeyboardAvoidingView>
  );
};

export default SendOtpIndex;
