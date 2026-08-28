import { useEffect } from "react";
import {
  useSharedValue,
  useAnimatedStyle,
  withDelay,
  withTiming,
} from "react-native-reanimated";

export const useFadeInLeft = (
  trigger?: string | number | boolean,
  index = 10,
) => {
  const opacity = useSharedValue(0);
  const translateX = useSharedValue(-30);

  useEffect(() => {
    opacity.value = 0;
    translateX.value = -30;

    const delay = index * 80;

    opacity.value = withDelay(delay, withTiming(1, { duration: 300 }));
    translateX.value = withDelay(delay, withTiming(0, { duration: 300 }));
  }, [trigger, index]);

  const fadeInLeftStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateX: translateX.value }],
  }));

  return { fadeInLeftStyle };
};
