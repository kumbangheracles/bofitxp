import React, { useEffect, useRef } from "react";
import {
  View,
  Animated,
  StyleSheet,
  useColorScheme,
  Easing,
} from "react-native";
import { Colors } from "@/constants/theme"; // sesuaikan path

const DOT_SIZE = 20;

const Dot = ({ color, delay }: { color: string; delay: number }) => {
  const bounce = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(bounce, {
          toValue: 1,
          duration: 300,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(bounce, {
          toValue: 0,
          duration: 300,
          easing: Easing.in(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.delay(700 - delay),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [bounce, delay]);

  const translateY = bounce.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -10],
  });

  return (
    <Animated.View
      style={[
        styles.dot,
        { backgroundColor: color, transform: [{ translateY }] },
      ]}
    />
  );
};

const Loader = () => {
  const scheme = useColorScheme();
  const theme = Colors[scheme === "dark" ? "dark" : "light"];

  return (
    <View style={styles.wrapper}>
      <Dot color={theme.primaryMuted} delay={0} />
      <Dot color={theme.primaryHover} delay={150} />
      <Dot color={theme.primary} delay={300} />
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  dot: {
    width: DOT_SIZE,
    height: DOT_SIZE,
    borderRadius: DOT_SIZE / 2,
  },
});

export default Loader;
