import { useRef } from "react";
import { Animated } from "react-native";

export const usePressScale = (scale = 0.95) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const onPressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: scale,
      useNativeDriver: true,
    }).start();
  };

  const onPressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  return {
    scaleAnim,
    pressScaleStyle: {
      transform: [{ scale: scaleAnim }],
    },
    onPressIn,
    onPressOut,
  };
};
