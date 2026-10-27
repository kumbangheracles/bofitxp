import AppGradButton from "@/components/app-gradient-btn";
import AppInput from "@/components/app-input";
import {
  AppTheme,
  Fonts,
  fontSize,
  fontWeight,
  spacing,
} from "@/constants/theme";
import { useAppTheme } from "@/hooks/use-app-theme";
import useRegister from "@/hooks/use-register";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
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

  type GenderValue = "pria" | "wanita";
  type GenderIcon = "gender-male" | "gender-female";

  const [gender, setGender] = useState<GenderValue | "">("");
  const GENDER_OPTIONS: Array<{
    label: string;
    value: GenderValue;
    icon: GenderIcon;
    color: string;
  }> = [
    { label: "Men", value: "pria", icon: "gender-male", color: "#3B82F6" },
    {
      label: "Woman",
      value: "wanita",
      icon: "gender-female",
      color: "#EC4899",
    },
  ];
  // useEffect(() => {
  //   console.log("Error: ", errors);
  // }, [errors]);

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
                style={{ fontSize: 16, color: theme.text, fontWeight: "bold" }}
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
            name="gender"
            render={({ field: { onChange, value } }) => (
              <View>
                <Text style={[styles.label, { color: theme.textHint }]}>
                  Gender
                </Text>

                <View style={styles.row}>
                  {GENDER_OPTIONS.map((option) => {
                    const isActive = value === option.value;

                    return (
                      <Pressable
                        key={option.value}
                        onPress={() => onChange(option.value)}
                        disabled={isPendingRegister}
                        style={({ pressed }) => [
                          styles.option,
                          {
                            backgroundColor: isActive
                              ? `${option.color}1A`
                              : theme.elevated,
                            borderColor: isActive ? option.color : theme.border,
                            borderWidth: isActive ? 1.5 : 1,
                            opacity: isPendingRegister
                              ? 0.6
                              : pressed
                                ? 0.8
                                : 1,
                          },
                        ]}
                      >
                        <View
                          style={[
                            styles.iconWrap,
                            {
                              backgroundColor: isActive
                                ? option.color
                                : `${option.color}1A`,
                            },
                          ]}
                        >
                          <MaterialCommunityIcons
                            name={option.icon}
                            size={22}
                            color={isActive ? "#FFFFFF" : option.color}
                          />
                        </View>

                        <Text
                          style={[
                            styles.optionText,
                            { color: isActive ? option.color : theme.text },
                          ]}
                        >
                          {option.label}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
              </View>
            )}
          />

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
                isPassword
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
                isPassword
                disableFullscreenUI={isPendingRegister}
                label="ConfirmPassword"
                onChangeText={onChange}
                value={value}
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
                    color: pressed ? theme.primaryHover : theme.primaryLabel,
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
      color: theme.textSecondary,
      fontSize: 13,
    },
    loginLink: {
      color: theme.primaryLabel,
      fontWeight: "bold",
      textDecorationLine: "underline",
    },
    label: {
      fontSize: fontSize.xs,
      marginBottom: 8,
    },
    row: {
      flexDirection: "row",
      gap: 12,
    },
    option: {
      flex: 1,
      paddingVertical: 16,
      borderRadius: 16,
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      gap: 8,
    },
    iconWrap: {
      width: 30,
      height: 30,
      borderRadius: 22,
      justifyContent: "center",
      alignItems: "center",
    },
    optionText: {
      fontSize: fontSize.sm,
      fontWeight: fontWeight.medium,
    },
    check: {
      position: "absolute",
      top: 8,
      right: 8,
    },
  });
