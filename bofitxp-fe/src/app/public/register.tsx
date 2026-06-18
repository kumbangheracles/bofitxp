import AppGradButton from "@/components/app-gradient-btn";
import AppInput from "@/components/app-input";
import { AppTheme, Fonts, fontWeight, spacing } from "@/constants/theme";
import { useAppTheme } from "@/hooks/use-app-theme";
import instance from "@/libs/axios/instance";
import { UserProps } from "@/types/user.type";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

// interface LoginForm extends LoginProps {}

export default function RegisterScreen() {
  const theme = useAppTheme();
  const styles = makeStyles(theme);
  const handleSubmit = async (data: UserProps) => {
    // if (!data.)
    //   return alert("Username atau Email tidak boleh kosong");
    // if (!data.password) return alert("Password tidak boleh kosong");
    try {
      const res = await instance.post("/register");
      // console.log("REsdata: ", resData);
      // if (res.status === 200) {
      //   router.replace("/private/private-dashboard");
      // }
    } catch (error) {
      //   alert("Failed Login");
      alert("Register Failed");
      console.log("error Login: ", error);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.container}>
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
          <Text style={styles.title}>Welcome</Text>

          <AppInput label="Full Name" autoCapitalize="none" />
          <AppInput
            label="Email"
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <AppInput label="Password" secureTextEntry />
          <AppInput label="Confirm Password" secureTextEntry />

          <AppGradButton
            label="Register"
            title=""
            variantGrad="primary"
            onPress={() => router.push("/public/activation")}
            isGrad={true}
          />

          <View style={{ position: "relative", width: "100%" }}>
            <View
              style={{
                height: 2,
                width: "100%",
                marginBlock: 16,
                backgroundColor: theme.border,
              }}
            ></View>
            <Text
              style={{
                position: "absolute",
                fontSize: 12,
                color: theme.textHint,
                paddingInline: 12,
                left: "30%",
                top: 8,
                backgroundColor: theme.surface,
              }}
            >
              Or sign up with
            </Text>
          </View>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              flexGrow: 1,
            }}
          >
            <AppGradButton
              variantGrad="secondary"
              viewStyle={{ width: "90%" }}
              label=""
              isGrad={true}
              title=""
              icon={<MaterialCommunityIcons name="google" size={20} />}
            />
            <AppGradButton
              variantGrad="secondary"
              viewStyle={{ width: "90%" }}
              label=""
              isGrad={true}
              title=""
              icon={<MaterialCommunityIcons name="apple" size={20} />}
            />
          </View>

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
            <Text style={styles.loginText}>Already have an account? </Text>
            <Pressable
              style={({ pressed }) => ({
                opacity: pressed ? 0.5 : 1,
              })}
              onPress={() => router.push("/public/login")}
            >
              {({ pressed }) => (
                <Text
                  style={{
                    color: pressed ? "#836dc5" : "#a78bfa",
                    fontWeight: "bold",
                    textDecorationLine: "underline",
                  }}
                >
                  Sign In
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
      paddingLeft: 16,
      paddingRight: 16,
      paddingBottom: 80,
      paddingTop: 80,
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
