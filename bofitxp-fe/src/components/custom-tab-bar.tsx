import { spacing, fontWeight } from "@/constants/theme";
import { useAppTheme } from "@/hooks/use-app-theme";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { BottomTabBarProps } from "expo-router/build/react-navigation/bottom-tabs";
import { useEffect } from "react";
import { Dimensions, Pressable, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

const HORIZONTAL_PADDING = 10;

export default function CustomTabBar({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) {
  const theme = useAppTheme();
  const width = Dimensions.get("window").width;

  const containerWidth = width - HORIZONTAL_PADDING * 2;
  const tabWidth = containerWidth / 4; // pastikan sama persis dgn lebar tiap Pressable

  const activeIndex = useSharedValue(state.index);

  useEffect(() => {
    activeIndex.value = withSpring(state.index, {
      damping: 40,
      stiffness: 1000,
      mass: 1,
    });
  }, [state.index]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: activeIndex.value * tabWidth }],
  }));

  const listTabs = [
    { key: "index", label: "Home", icon: "home-outline" },
    { key: "quests", label: "Quests", icon: "circle-off-outline" },
    { key: "exercise", label: "Exercise", icon: "dumbbell" },
    { key: "achievements", label: "Achievements", icon: "trophy-variant" },
  ] as const;

  return (
    <View
      style={{
        flexDirection: "row",
        paddingHorizontal: HORIZONTAL_PADDING,
        paddingVertical: 12,
        marginBottom: 44,
        backgroundColor: theme.background,
        borderTopWidth: 1,
        borderColor: theme.border,
      }}
    >
      {/* indicator geser */}
      <Animated.View
        style={[
          {
            position: "absolute",
            top: 12,
            left: HORIZONTAL_PADDING,
            width: tabWidth,
            height: 48,
            borderRadius: 12,
            backgroundColor: theme.elevated,
          },
          animatedStyle,
        ]}
      />

      {listTabs.map((item, index) => {
        const focused = state.index === index;

        return (
          <Pressable
            key={item.key}
            onPress={() => navigation.navigate(item.key)}
            style={{
              width: tabWidth, // WAJIB sama dgn tabWidth, bukan minWidth
              alignItems: "center",
              justifyContent: "center",
              gap: 4,
              paddingVertical: spacing.sm,
              // backgroundColor dihapus dari sini, biar indicator yg handle
            }}
          >
            <MaterialCommunityIcons
              name={item.icon}
              size={18}
              color={focused ? theme?.primaryLabel : theme.textHint}
            />
            <Text
              style={{
                fontSize: 10,
                fontWeight: fontWeight.bold,
                color: focused ? theme?.primaryLabel : theme.textSecondary,
              }}
            >
              {item.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
