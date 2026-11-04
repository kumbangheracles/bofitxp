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
const ActivationScreen = () => {
  const theme = useAppTheme();
  const authService = new AuthService();
  const [code, setCode] = useState<string>("");
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
        const res = await authService.activationCode(code);
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
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={{
          backgroundColor: theme.background,
          padding: 16,
          flexGrow: 1,
          justifyContent: "center",
          position: "relative",
        }}
      >
        <SafeAreaView>
          <AppGradButton
            title={"Back"}
            onPress={() => router.back()}
            viewStyle={{
              position: "absolute",
              top: -200,
              left: 0,
              zIndex: 999,
            }}
            icon={
              <MaterialCommunityIcons
                name="arrow-left"
                size={16}
                style={{
                  color: theme.primaryLabel,
                  padding: spacing.md,
                  backgroundColor: theme.background,
                  borderColor: theme.primaryLabel,
                  borderRadius: radius.md,
                  borderWidth: 1,
                }}
              />
            }
            label={""}
          />
        </SafeAreaView>
        <AppActivationCodeCard
          subtitle="Activation code has sended to your email"
          value={code}
          onChangeCode={setCode}
          onSubmit={() => handleSubmit("activation")}
          onResend={() => handleSubmit("resendActivationCode")}
          loading={loading}
          resendLoading={loading}
          error={error}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default ActivationScreen;
