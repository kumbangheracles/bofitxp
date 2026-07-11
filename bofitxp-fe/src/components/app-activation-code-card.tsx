import { useAppTheme } from "@/hooks/use-app-theme";
import type { AppTheme } from "@/constants/theme";
import { fontSize, fontWeight, radius, spacing } from "@/constants/theme";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Keyboard,
  NativeSyntheticEvent,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TextInputKeyPressEventData,
  View,
  ViewStyle,
} from "react-native";
import AppGradButton from "./app-gradient-btn";

interface AppActivationCodeCardProps {
  /** Judul di atas card */
  title?: string;
  /** Instruksi tambahan, misal "Kode dikirim ke email kamu" */
  subtitle?: string;
  /** Jumlah digit kode. Default 6 */
  codeLength?: number;
  /** Izinkan huruf selain angka (default: hanya numerik) */
  allowLetters?: boolean;
  /** Nilai kode saat ini — controlled dari parent */
  value: string;
  onChangeCode: (code: string) => void;
  /** Dipanggil saat tombol verifikasi ditekan */
  onSubmit: () => void;
  /** Dipanggil saat user tekan "Kirim Ulang" setelah cooldown habis */
  onResend: () => void;
  loading?: boolean;
  resendLoading?: boolean;
  /** Pesan error — trigger shake animation + border merah */
  error?: string;
  /** Durasi cooldown resend (detik). Default 60 */
  resendCooldownSeconds?: number;
  style?: ViewStyle;
}

const formatCooldown = (seconds: number) => {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
};

export default function AppActivationCodeCard({
  title = "Input activation code",
  subtitle,
  codeLength = 6,
  allowLetters = false,
  value,
  onChangeCode,
  onSubmit,
  onResend,
  loading = true,
  resendLoading = true,
  error,
  resendCooldownSeconds = 60,
  style,
}: AppActivationCodeCardProps) {
  const theme = useAppTheme();
  const styles = getStyles(theme);

  const inputRefs = useRef<Array<TextInput | null>>([]);
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
  const [secondsLeft, setSecondsLeft] = useState(resendCooldownSeconds);

  const shakeAnim = useRef(new Animated.Value(0)).current;
  const prevErrorRef = useRef<string | undefined>(undefined);

  const digits = Array.from({ length: codeLength }, (_, i) => value[i] ?? "");
  const isComplete = value.length === codeLength;

  // Countdown timer resend
  useEffect(() => {
    if (secondsLeft <= 0) return;
    const interval = setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [secondsLeft]);

  // Shake saat error baru muncul (bukan setiap re-render)
  useEffect(() => {
    if (error && error !== prevErrorRef.current) {
      Animated.sequence([
        Animated.timing(shakeAnim, {
          toValue: 8,
          duration: 50,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnim, {
          toValue: -8,
          duration: 50,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnim, {
          toValue: 6,
          duration: 50,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnim, {
          toValue: -6,
          duration: 50,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnim, {
          toValue: 0,
          duration: 50,
          useNativeDriver: true,
        }),
      ]).start();
    }
    prevErrorRef.current = error;
  }, [error, shakeAnim]);

  const sanitize = (text: string) =>
    allowLetters ? text.toUpperCase() : text.replace(/[^0-9]/g, "");

  const setDigit = (str: string, index: number, char: string) => {
    const arr = Array.from({ length: codeLength }, (_, i) => str[i] ?? "");
    arr[index] = char;
    let end = codeLength;
    while (end > 0 && arr[end - 1] === "") end--;
    return arr.slice(0, end).join("");
  };

  const handleChangeText = (rawText: string, index: number) => {
    const text = sanitize(rawText);

    if (text.length <= 1) {
      const next = setDigit(value, index, text);
      onChangeCode(next);
      if (text && index < codeLength - 1) {
        inputRefs.current[index + 1]?.focus();
      } else if (text && index === codeLength - 1) {
        Keyboard.dismiss();
      }
      return;
    }

    // Paste atau autofill: distribusikan karakter mulai dari box ini
    const pasted = text.slice(0, codeLength - index);
    let next = value;
    pasted.split("").forEach((char, i) => {
      next = setDigit(next, index + i, char);
    });
    onChangeCode(next);

    const lastFilled = Math.min(index + pasted.length, codeLength - 1);
    if (index + pasted.length >= codeLength) {
      Keyboard.dismiss();
      inputRefs.current[lastFilled]?.blur();
    } else {
      inputRefs.current[lastFilled]?.focus();
    }
  };

  const handleKeyPress = (
    e: NativeSyntheticEvent<TextInputKeyPressEventData>,
    index: number,
  ) => {
    if (e.nativeEvent.key === "Backspace" && !digits[index] && index > 0) {
      const next = value.slice(0, index - 1) + value.slice(index);
      onChangeCode(next);
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleResendPress = () => {
    if (secondsLeft > 0 || resendLoading) return;
    onResend();
    setSecondsLeft(resendCooldownSeconds);
  };

  return (
    <View style={[styles.card, style]}>
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}

      <Animated.View
        style={[styles.otpRow, { transform: [{ translateX: shakeAnim }] }]}
      >
        {digits.map((digit, index) => {
          const isFocused = focusedIndex === index;
          const hasError = Boolean(error);
          return (
            <TextInput
              key={index}
              ref={(ref) => {
                inputRefs.current[index] = ref;
              }}
              value={digit}
              onChangeText={(text) => handleChangeText(text, index)}
              onKeyPress={(e) => handleKeyPress(e, index)}
              onFocus={() => setFocusedIndex(index)}
              onBlur={() =>
                setFocusedIndex((prev) => (prev === index ? null : prev))
              }
              keyboardType={allowLetters ? "default" : "number-pad"}
              autoCapitalize={allowLetters ? "characters" : "none"}
              maxLength={codeLength - index}
              textContentType="oneTimeCode"
              autoComplete={index === 0 ? "sms-otp" : "off"}
              selectTextOnFocus
              style={[
                styles.otpBox,
                isFocused && styles.otpBoxFocused,
                hasError && styles.otpBoxError,
              ]}
            />
          );
        })}
      </Animated.View>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <AppGradButton
        label={loading ? "" : "Submit"}
        isGrad
        variantGrad="primary"
        onPress={onSubmit}
        disabled={loading || !isComplete}
        icon={
          loading ? (
            <ActivityIndicator size="small" color={theme.textSecondary} />
          ) : undefined
        }
        viewStyle={{
          opacity: loading || !isComplete ? 0.55 : 1,
          marginTop: spacing.md,
        }}
        title={""}
      />

      <View style={styles.resendRow}>
        <Text style={styles.resendLabel}>Didn't get the code? </Text>
        {secondsLeft > 0 ? (
          <Text style={styles.resendCooldown}>
            Send again in {formatCooldown(secondsLeft)}
          </Text>
        ) : (
          <Pressable
            onPress={handleResendPress}
            disabled={resendLoading}
            hitSlop={8}
          >
            <Text style={styles.resendActive}>
              {resendLoading ? "Sending . . ." : "Send again"}
            </Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}

const getStyles = (theme: AppTheme) =>
  StyleSheet.create({
    card: {
      backgroundColor: theme.surface,
      borderRadius: radius.xl,
      borderWidth: 1,
      borderColor: theme.border,
      padding: spacing.lg,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 12,
      elevation: 4,
    },
    title: {
      fontSize: fontSize.lg,
      fontWeight: fontWeight.bold,
      color: theme.text,
      textAlign: "center",
    },
    subtitle: {
      fontSize: fontSize.sm,
      color: theme.textSecondary,
      textAlign: "center",
      marginTop: spacing.xs,
    },
    otpRow: {
      flexDirection: "row",
      gap: spacing.sm,
      marginTop: spacing.lg,
    },
    otpBox: {
      flex: 1,
      aspectRatio: 0,
      borderRadius: radius.md,
      borderWidth: 1.5,
      borderColor: theme.border,
      backgroundColor: theme.elevated,
      textAlign: "center",
      fontSize: fontSize.xl,
      fontWeight: fontWeight.bold,
      color: theme.text,
    },
    otpBoxFocused: {
      borderColor: theme.primary,
    },
    otpBoxError: {
      borderColor: theme.danger,
    },
    errorText: {
      color: theme.danger,
      fontSize: fontSize.sm,
      marginTop: spacing.sm,
      textAlign: "center",
    },
    resendRow: {
      flexDirection: "row",
      justifyContent: "center",
      marginTop: spacing.lg,
      flexWrap: "wrap",
    },
    resendLabel: {
      fontSize: fontSize.sm,
      color: theme.textSecondary,
    },
    resendCooldown: {
      fontSize: fontSize.sm,
      color: theme.textHint,
      fontWeight: fontWeight.medium,
    },
    resendActive: {
      fontSize: fontSize.sm,
      color: theme.primary,
      fontWeight: fontWeight.bold,
    },
  });
