import React, { useEffect, ComponentProps } from "react";
import { Pressable } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolateColor,
} from "react-native-reanimated";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const AnimatedIcon = Animated.createAnimatedComponent(MaterialCommunityIcons);

export interface QuestCategory {
  id: number;
  key: string;
  title: string;
  iconName: ComponentProps<typeof MaterialCommunityIcons>["name"];
}

interface AnimatedTabButtonProps {
  item: QuestCategory;
  isActive: boolean;
  onPress: () => void;
  theme: {
    surface: string;
    primaryLabel: string;
    textHint: string;
    textSecondary: string;
  };
  spacing: {
    lg: number;
  };
}

const AnimatedTabButton: React.FC<AnimatedTabButtonProps> = ({
  item,
  isActive,
  onPress,
  theme,
  spacing,
}) => {
  const progress = useSharedValue<number>(isActive ? 1 : 0);

  useEffect(() => {
    progress.value = withTiming(isActive ? 1 : 0, { duration: 250 });
  }, [isActive]);

  const animatedContainerStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      progress.value,
      [0, 1],
      [theme.surface, theme.primaryLabel],
    );
    return { backgroundColor };
  });

  const animatedIconStyle = useAnimatedStyle(() => {
    const color = interpolateColor(
      progress.value,
      [0, 1],
      [theme.textHint, "#FFFFFF"],
    );
    return { color };
  });

  const animatedTextStyle = useAnimatedStyle(() => {
    const color = interpolateColor(
      progress.value,
      [0, 1],
      [theme.textSecondary, "#FFFFFF"],
    );
    return { color };
  });

  return (
    <Pressable onPress={onPress}>
      <Animated.View
        style={[
          {
            width: 100,
            paddingVertical: 8,
            paddingHorizontal: spacing.lg,
            borderRadius: 12,
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "row",
            gap: 4,
          },
          animatedContainerStyle,
        ]}
      >
        <AnimatedIcon
          name={item.iconName}
          size={18}
          style={animatedIconStyle as any}
        />
        <Animated.Text
          style={[
            {
              fontWeight: isActive ? "600" : "400",
            },
            animatedTextStyle,
          ]}
        >
          {item?.title}
        </Animated.Text>
      </Animated.View>
    </Pressable>
  );
};

export default AnimatedTabButton;
