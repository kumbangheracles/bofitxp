import { AppTheme, Fonts, spacing } from "@/constants/theme";
import { useAppTheme } from "@/hooks/use-app-theme";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { ReactNode, useEffect, useState } from "react";
import {
  Pressable,
  TextInput,
  TextInputProps,
  View,
  Text,
  StyleSheet,
} from "react-native";
import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedStyle,
  interpolateColor,
} from "react-native-reanimated";
import styled from "styled-components/native";

interface PropTypes extends TextInputProps {
  icon?: ReactNode;
  label?: string;
  isPassword?: boolean;
  containerStyles?: React.CSSProperties;
  labelStyles?: React.CSSProperties;
}

const AppInput = ({
  icon,
  label,
  containerStyles,
  labelStyles,
  isPassword = false,
  ...props
}: PropTypes) => {
  const theme = useAppTheme();
  const [openPass, setOpenPass] = useState<boolean>(false);
  const [isFocus, setIsFocus] = useState<boolean>(false);

  const progress = useSharedValue<number>(0);
  const styles = makeStyles(theme);
  useEffect(() => {
    progress.value = withTiming(isFocus ? 1 : 0, { duration: 300 });
  }, [isFocus]);

  const animatedStyled = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      progress.value,
      [0, 1],
      [theme.border, theme.elevated],
    ),
  }));

  return (
    <View style={{ ...styles.formGroup, ...{ containerStyles } }}>
      {label && (
        <Text style={{ ...styles.label, ...{ labelStyles } }}>{label}</Text>
      )}

      <AnimatedStyledContainer theme={theme} style={animatedStyled}>
        <View
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            flexDirection: "row",
          }}
        >
          {icon}

          <TextInput
            onFocus={() => setIsFocus(true)}
            onBlur={() => setIsFocus(false)}
            style={{ ...styles.input, ...props.style }}
            secureTextEntry={openPass}
            {...props}
          />
        </View>

        {isPassword && (
          <Pressable>
            {openPass ? (
              <MaterialCommunityIcons
                onPress={() => setOpenPass(false)}
                style={{ color: theme.textHint, marginRight: 20 }}
                name="eye-closed"
                size={20}
              />
            ) : (
              <MaterialCommunityIcons
                onPress={() => setOpenPass(true)}
                style={{ color: theme.textHint, marginRight: 20 }}
                name="eye"
                size={20}
              />
            )}
          </Pressable>
        )}
      </AnimatedStyledContainer>
    </View>
  );
};

const StyledContainerInput = styled.View<{
  theme: AppTheme;
}>(({ theme }) => ({
  backgroundColor: theme.elevated,

  paddingVertical: 3,
  paddingLeft: 16,
  paddingRight: 40,

  borderRadius: 16,
  borderWidth: 1,

  flexDirection: "row",
  alignItems: "center",
}));
const AnimatedStyledContainer =
  Animated.createAnimatedComponent(StyledContainerInput);

const makeStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      backgroundColor: theme.background,
      justifyContent: "center",
      height: "100%",
      padding: 20,
    },

    formGroup: {
      marginBottom: 12,
    },
    label: {
      fontSize: 13,
      fontWeight: "600",
      color: "#ddd6fe",
      fontFamily: Fonts.sans,
      marginBottom: 6,
    },
    input: {
      width: "100%",
      color: "#f5f3ff",
      fontSize: 14,
    },
  });

export default AppInput;
