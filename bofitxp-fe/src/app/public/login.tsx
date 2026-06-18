// import { LoginProps, userLogin } from "@/libs/api/MahasiswaApi";
import { AppTheme, Fonts, fontWeight, spacing } from "@/constants/theme";
import { useAppTheme } from "@/hooks/use-app-theme";
import { router } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import AppInput from "@/components/app-input";
import AppGradButton from "@/components/app-gradient-btn";

// interface LoginForm extends LoginProps {}

export default function LoginScreen() {
  const theme = useAppTheme();
  const styles = makeStyles(theme);

  //   const handleSubmit = async (data: LoginForm) => {
  //     if (!data.identifier)
  //       return alert("Username atau Email tidak boleh kosong");
  //     if (!data.password) return alert("Password tidak boleh kosong");

  //     console.log("Login data:", formData);
  //     try {
  //       const res = await userLogin(data);
  //       const resData = await res.json();
  //       console.log("REsdata: ", resData);
  //       if (res.ok) {
  //         await storage.set("token", resData.data);
  //         router.replace("/private/private-dashboard");
  //       }
  //     } catch (error) {
  //       //   alert("Failed Login");
  //       console.log("error Login: ", error);
  //     }
  //   };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.container} className="p-4">
        <View style={{ width: "100%", marginBlock: 20 }}>
          <MaterialCommunityIcons
            name="lightning-bolt"
            size={24}
            style={styles.iconBoFitXp}
          />
          <View
            style={{
              display: "flex",
              width: "100%",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <View
              style={{
                display: "flex",
                alignItems: "center",
                flexDirection: "row",
                marginTop: 7,
              }}
            >
              <Text
                style={{ fontSize: 16, color: "white", fontWeight: "bold" }}
              >
                BoFit
              </Text>
              <Text
                style={{
                  fontSize: 16,
                  color: theme.primary,
                  fontWeight: "bold",
                }}
              >
                XP
              </Text>
            </View>
            <Text
              style={{
                color: theme.textHint,
                fontSize: 14,
                marginBlock: 10,
              }}
            >
              Level up your fitness journey
            </Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.title}>Welcome Back</Text>

          <AppInput
            label="Email"
            keyboardType="email-address"
            autoCapitalize="none"
            icon={
              <MaterialCommunityIcons
                name="email"
                size={20}
                style={{ color: theme.textHint }}
              />
            }
          />
          <AppInput
            label="Password"
            secureTextEntry
            icon={
              <MaterialCommunityIcons
                name="lock"
                size={20}
                style={{ color: theme.textHint }}
              />
            }
          />

          <View
            style={{
              marginBottom: 16,
              display: "flex",
              width: "100%",
              justifyContent: "flex-end",
              flexDirection: "row",
            }}
          >
            <Pressable
              onPress={() => console.log("Clicked")}
              style={({ pressed }) => ({
                opacity: pressed ? 0.5 : 1,
              })}
            >
              {({ pressed }) => (
                <Text
                  style={{
                    color: pressed ? "gray" : theme.primaryLabel,
                    fontWeight: fontWeight.semibold,
                  }}
                >
                  Forgot Password?
                </Text>
              )}
            </Pressable>
          </View>

          <AppGradButton
            label="Login"
            title=""
            variantGrad="primary"
            isGrad={true}
          />

          <View
            style={{
              marginTop: 14,
              display: "flex",
              justifyContent: "center",
              gap: 8,
              alignItems: "center",
              flexDirection: "row",
            }}
          >
            <Text style={styles.loginText}>Dont't have an account? </Text>
            <Pressable
              style={({ pressed }) => ({
                opacity: pressed ? 0.5 : 1,
              })}
              onPress={() => router.push("/public/register")}
            >
              {({ pressed }) => (
                <Text
                  style={{
                    color: pressed ? "#836dc5" : "#a78bfa",
                    fontWeight: "bold",
                    textDecorationLine: "underline",
                  }}
                >
                  Sign Up
                </Text>
              )}
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const makeStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      backgroundColor: theme.background,
      padding: 40,

      justifyContent: "center",
      alignItems: "center",
      flexGrow: 1,
    },

    iconBoFitXp: {
      backgroundColor: theme.surface,
      color: theme.text,
      width: 50,
      height: 50,
      display: "flex",
      alignItems: "center",
      padding: 10,
      textAlign: "center",
      borderRadius: 16,
      marginInline: "auto",
    },
    card: {
      backgroundColor: theme.surface,
      borderRadius: 16,
      padding: 24,
      borderWidth: 1,
      borderColor: theme.border,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 8,
    },
    title: {
      fontSize: 28,
      fontWeight: "bold",
      fontFamily: Fonts.mono,
      color: theme.text,
      marginBottom: spacing.lg,
    },

    loginText: {
      textAlign: "center",
      color: "#c4b5fd",

      fontSize: 13,
    },
    loginLink: {
      color: "#a78bfa",
      fontWeight: "bold",
      textDecorationLine: "underline",
    },
  });
