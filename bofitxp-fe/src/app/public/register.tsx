import AppGradButton from "@/components/app-gradient-btn";
import AppInput from "@/components/app-input";
import environtment from "@/constants/environtments";
import { AppTheme, Fonts, spacing } from "@/constants/theme";
import { useAppTheme } from "@/hooks/use-app-theme";
import useRegister from "@/hooks/use-register";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect } from "react";
import { Controller } from "react-hook-form";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function RegisterScreen() {
  const theme = useAppTheme();
  const styles = makeStyles(theme);

  const { control, errors, handleRegister, handleSubmit, isPendingRegister } =
    useRegister();

  useEffect(() => {
    console.log("Error: ", errors);
    // console.log("API_URL: ", environtment.EXPO_BASE_URL);
  }, [errors]);
  useEffect(() => {
    console.log("API_URL: ", environtment.EXPO_BASE_URL);
  }, []);

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

          <Controller
            control={control}
            name="fullName"
            rules={{ required: true }}
            render={({ field: { onChange, value } }) => (
              <AppInput
                label="Full Name"
                disableFullscreenUI={isPendingRegister}
                onChangeText={onChange}
                value={value}
                autoCapitalize="none"
              />
            )}
          />
          {errors.fullName && (
            <Text style={{ color: theme.danger, marginBottom: 10 }}>
              {errors.fullName.message || "This field is required."}
            </Text>
          )}
          <Controller
            control={control}
            name="username"
            rules={{ required: true }}
            render={({ field: { onChange, value } }) => (
              <AppInput
                label="Username"
                disableFullscreenUI={isPendingRegister}
                onChangeText={onChange}
                value={value}
                autoCapitalize="none"
              />
            )}
          />
          {errors.username && (
            <Text style={{ color: theme.danger, marginBottom: 10 }}>
              {errors.username.message || "This field is required."}
            </Text>
          )}

          <Controller
            control={control}
            name="email"
            rules={{ required: true }}
            render={({ field: { onChange, value } }) => (
              <AppInput
                label="Email"
                disableFullscreenUI={isPendingRegister}
                keyboardType="email-address"
                autoCapitalize="none"
                onChangeText={onChange}
                value={value}
              />
            )}
          />

          {errors.email && (
            <Text style={{ color: theme.danger, marginBottom: 10 }}>
              {errors.email.message || "This field is required."}
            </Text>
          )}
          <Controller
            control={control}
            name="password"
            rules={{ required: true }}
            render={({ field: { onChange, value } }) => (
              <AppInput
                disableFullscreenUI={isPendingRegister}
                label="Password"
                onChangeText={onChange}
                value={value}
                secureTextEntry
              />
            )}
          />

          {errors.password && (
            <Text style={{ color: theme.danger, marginBottom: 10 }}>
              {errors.password.message || "This field is required."}
            </Text>
          )}

          <Controller
            control={control}
            name="confirmPassword"
            rules={{ required: true }}
            render={({ field: { onChange, value } }) => (
              <AppInput
                disableFullscreenUI={isPendingRegister}
                label="ConfirmPassword"
                onChangeText={onChange}
                value={value}
                secureTextEntry
              />
            )}
          />

          {errors.confirmPassword && (
            <Text style={{ color: theme.danger, marginBottom: 10 }}>
              {errors.confirmPassword.message || "This field is required."}
            </Text>
          )}

          <AppGradButton
            label="Register"
            title=""
            disabled={isPendingRegister}
            variantGrad="primary"
            onPress={handleSubmit(handleRegister)}
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
              disabled={isPendingRegister}
              title=""
              icon={<MaterialCommunityIcons name="google" size={20} />}
            />
            <AppGradButton
              variantGrad="secondary"
              viewStyle={{ width: "90%" }}
              label=""
              isGrad={true}
              disabled={isPendingRegister}
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
              disabled={isPendingRegister}
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
