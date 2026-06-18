import AppActivationCodeCard from "@/components/app-activation-code-card";
import { useAppTheme } from "@/hooks/use-app-theme";
import { useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, View } from "react-native";

const ActivationScreen = () => {
  const theme = useAppTheme();

  const [code, setCode] = useState("");
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    setError(undefined);
    try {
      // await verifyActivationCode(code);
    } catch {
      setError("Kode salah, coba lagi.");
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
        }}
      >
        <AppActivationCodeCard
          subtitle="Activation code has sended to your email"
          value={code}
          onChangeCode={setCode}
          onSubmit={handleSubmit}
          //   onResend={() => resendActivationCode()}
          loading={loading}
          error={error}
          onResend={() => {}}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default ActivationScreen;
