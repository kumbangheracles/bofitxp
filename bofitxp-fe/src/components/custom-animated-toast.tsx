import React, { useEffect } from "react";
import { StyleSheet, Text, View, ViewStyle, TextStyle } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withRepeat,
  withSequence,
  withTiming,
  FadeInUp,
  FadeOutUp,
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";

export interface ToastProps {
  visible: boolean;
  title: string;
  subtitle?: string;
  icons?: React.ReactNode[];
  colors?: string[];
  containerStyle?: ViewStyle;
  titleStyle?: TextStyle;
  subtitleStyle?: TextStyle;
}

export const AnimatedToast: React.FC<ToastProps> = ({
  visible,
  title,
  subtitle,
  icons = [],
  colors = ["#FF7A00", "#FF3D00"],
  containerStyle,
  titleStyle,
  subtitleStyle,
}) => {
  const bounceAnim = useSharedValue(1);
  const rotateAnim = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      bounceAnim.value = withRepeat(
        withSequence(
          withTiming(1.08, { duration: 150 }),
          withTiming(1, { duration: 150 }),
        ),
        -1,
        true,
      );

      rotateAnim.value = withRepeat(
        withSequence(
          withTiming(-0.03, { duration: 100 }),
          withTiming(0.03, { duration: 100 }),
          withTiming(0, { duration: 100 }),
        ),
        -1,
        true,
      );
    } else {
      bounceAnim.value = 1;
      rotateAnim.value = 0;
    }
  }, [visible]);

  const animatedTextStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: bounceAnim.value },
      { rotate: `${rotateAnim.value}rad` },
    ],
  }));

  const animatedIconStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: bounceAnim.value * 1.1 },
      { translateY: Math.sin(bounceAnim.value * 10) * 3 },
    ],
  }));

  if (!visible) return null;

  return (
    <Animated.View
      entering={FadeInUp.springify().damping(12)}
      exiting={FadeOutUp.duration(200)}
      style={[styles.wrapper, containerStyle]}
    >
      {icons.length > 0 && (
        <Animated.View style={[styles.iconContainer, animatedIconStyle]}>
          {icons.map((icon, index) => (
            <View key={index} style={styles.iconWrapper}>
              {icon}
            </View>
          ))}
        </Animated.View>
      )}

      <Animated.Text style={[styles.mainTitle, animatedTextStyle, titleStyle]}>
        {title}
      </Animated.Text>

      {subtitle && (
        <LinearGradient
          colors={colors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.badgeContainer}
        >
          <Text style={[styles.badgeText, subtitleStyle]}>{subtitle}</Text>
        </LinearGradient>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    top: "20%",
    alignSelf: "center",
    alignItems: "center",
    zIndex: 9999,
    pointerEvents: "none",
  },
  iconContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "flex-end",
    marginBottom: -8,
    gap: 8,
  },
  iconWrapper: {
    padding: 4,
  },
  mainTitle: {
    fontSize: 36,
    fontWeight: "900",
    color: "#FF8800",
    textAlign: "center",
    textShadowColor: "rgba(255, 136, 0, 0.7)",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 15,
    letterSpacing: 1.5,
  },
  badgeContainer: {
    marginTop: 6,
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 20,
    shadowColor: "#FF5722",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 8,
  },
  badgeText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 18,
    textAlign: "center",
    letterSpacing: 0.5,
  },
});
