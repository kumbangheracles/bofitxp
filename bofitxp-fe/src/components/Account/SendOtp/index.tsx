import { useAuth } from "@/context/AuthContext";
import { useAppTheme } from "@/hooks/use-app-theme";
import { AuthService } from "@/services/auth.service";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, View } from "react-native";
import Toast from "react-native-toast-message";
import AppActivationCodeCard from "@/components/app-activation-code-card";
import AppGradButton from "@/components/app-gradient-btn";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { radius, spacing } from "@/constants/theme";
import { SafeAreaView } from "react-native-safe-area-context";
import { useGlobalState } from "@/context/GlobalStateContext";
import { UserService } from "@/services/user.service";

type KeyParams = "password" | "email";

const SendOtpIndex = () => {
  const { key } = useLocalSearchParams<{ key: KeyParams }>();
  const { authUser, login, setAuthUser } = useAuth();
  const theme = useAppTheme();
  const userService = new UserService();
  const authService = new AuthService();
  const {
    emailForOtp,
    pendingNewEmail,
    pendingPassword,
    currentPassword,
    setEmailForOtp,
    setPendingNewEmail,
    setPendingPassword,
    setCurrentPassword,
  } = useGlobalState();
  const [code, setCode] = useState<string>("");
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState(false);

  const targetEmail = pendingNewEmail ?? emailForOtp ?? authUser?.email ?? "";

  const handleSubmit = async (type: "activation" | "resendActivationCode") => {
    setLoading(true);
    setError(undefined);
    try {
      if (key === "email") {
        if (type === "activation") {
          if (!targetEmail) {
            throw new Error("Email target is missing");
          }

          const res = await userService.confirmEmailChange({
            email: targetEmail,
            otp: code,
          });

          const responseData = res?.data?.data ?? res?.data ?? {};
          const updatedUser = responseData.updatedUser ?? {};
          const nextToken = responseData.token;

          if (nextToken) {
            await login(nextToken);
          }

          if (updatedUser) {
            setAuthUser((prev) => ({
              ...(prev ?? {}),
              ...updatedUser,
            }));
          }

          if (res) {
            setPendingNewEmail(null);
            setEmailForOtp(null);
            Toast.show({
              type: "success",
              text1: "Email updated successfully.",
            });
            router.back();
          }
          return;
        }

        if (!targetEmail) {
          throw new Error("Email target is missing");
        }

        const res = await userService.requestEmailChange(targetEmail);
        if (res) {
          Toast.show({
            type: "success",
            text1: "OTP sent to your new email.",
          });
        }
        return;
      }

      if (key === "password") {
        if (type === "activation") {
          if (!pendingPassword || !currentPassword) {
            throw new Error("Password update data is missing");
          }

          const res = await userService.changePassword({
            currentPassword,
            newPassword: pendingPassword,
            confirmPassword: pendingPassword,
          });

          if (res) {
            setPendingPassword(null);
            setCurrentPassword(null);
            Toast.show({
              type: "success",
              text1: "Password updated successfully.",
            });
            router.back();
          }
          return;
        }

        const savedEmail = authUser?.email;
        if (!savedEmail) {
          throw new Error("Email is missing");
        }

        const res = await authService.resendActivationCode(savedEmail);
        if (res) {
          Toast.show({
            type: "success",
            text1: "Code resent successfully.",
          });
        }
        return;
      }
    } catch (error) {
      setError("Something went wrong.");
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
            onPress={() => {
              if (key === "email") {
                setPendingNewEmail(null);
                setCurrentPassword(null);
                setPendingPassword(null);
              }
              router.back();
            }}
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
          title={
            key === "email" ? "Verify new email" : "Verify password update"
          }
          subtitle={
            key === "email"
              ? `We sent a 6-digit OTP to ${targetEmail || "your new email"}`
              : "Enter the verification code to confirm your password change"
          }
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

export default SendOtpIndex;
