import {
  Animated,
  StyleSheet,
  Text,
  View,
  Dimensions,
  ScrollView,
} from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import {
  BottomTabInset,
  fontSize,
  fontWeight,
  MaxContentWidth,
  spacing,
  Spacing,
} from "@/constants/theme";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useAppTheme } from "@/hooks/use-app-theme";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useRef } from "react";
import ListTodayQuests from "@/components/Home/ListTodayQuests";
const { width } = Dimensions.get("window");
export default function index() {
  const theme = useAppTheme();
  const translateX = useRef(new Animated.Value(-width)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(translateX, {
        toValue: width,
        duration: 2500,
        useNativeDriver: true,
      }),
    ).start();
  }, [translateX]);
  const streak_list = [
    {
      id: 1,
      title: "Streak",
      label: "7 Days",
      icon: (
        <MaterialCommunityIcons name="fire" size={13} color={theme.combo} />
      ),
    },
    {
      id: 2,
      title: "Total XP",
      label: "2,450",
      icon: (
        <MaterialCommunityIcons
          name="lightning-bolt"
          size={13}
          color={theme.xp}
        />
      ),
    },
    {
      id: 3,
      title: "Level",
      label: "24",
      icon: (
        <MaterialCommunityIcons
          name="trophy"
          size={13}
          color={theme.achievement}
        />
      ),
    },
  ];
  return (
    <>
      <ScrollView>
        <ThemedView
          style={{
            paddingInline: spacing.md,
            paddingTop: 50,
            paddingBottom: 30,
            backgroundColor: theme.elevated,
          }}
        >
          {/* <SafeAreaView style={styles.safeArea}>
        <> */}
          <ThemedView
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              backgroundColor: theme.elevated,
            }}
          >
            <ThemedView style={{ backgroundColor: theme.elevated }}>
              <ThemedText>Welcome Back</ThemedText>
              <ThemedText style={{ fontWeight: 300, color: theme.textHint }}>
                Ready to level up?
              </ThemedText>
            </ThemedView>
            <ThemedView
              style={{
                flexDirection: "row",
                gap: 10,
                backgroundColor: theme.elevated,
              }}
            >
              <ThemedView
                style={{
                  padding: 10,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "50%",
                  width: 37,
                  height: 37,
                  backgroundColor: theme.border,
                }}
              >
                <MaterialCommunityIcons
                  style={{
                    color: theme.text,
                  }}
                  name="bell"
                  size={16}
                />
              </ThemedView>
              <ThemedView
                style={{
                  padding: 10,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "50%",
                  width: 37,
                  height: 37,
                  backgroundColor: theme.border,
                }}
              >
                <MaterialCommunityIcons
                  style={{
                    color: theme.text,
                  }}
                  name="cog"
                  size={16}
                />
              </ThemedView>
            </ThemedView>
          </ThemedView>

          {/* Card Section */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              gap: 20,
              marginTop: 20,
            }}
          >
            {/* Streak Card */}
            {streak_list.map((item) => (
              <View
                key={item.id}
                style={{
                  backgroundColor: theme.border,
                  padding: 12,
                  borderColor: theme.textHint,
                  borderWidth: 1,
                  borderRadius: 16,
                  minWidth: 90,
                }}
              >
                <View
                  style={{ flexDirection: "row", gap: 4, alignItems: "center" }}
                >
                  <View>{item.icon}</View>
                  <Text
                    style={{
                      color: theme.textSecondary,
                      fontSize: fontSize.xs,
                    }}
                  >
                    {item.title}
                  </Text>
                </View>
                <Text
                  style={{ color: theme.text, fontWeight: 700, fontSize: 17 }}
                >
                  {item.label}
                </Text>
              </View>
            ))}
          </View>
          {/* </> */}

          {/* Level Progress Section */}

          <View
            style={{
              padding: spacing.md,
              backgroundColor: theme.border,
              borderColor: theme.textHint,
              borderWidth: 1,
              borderRadius: 16,
              marginInline: 8,
              marginTop: 16,
            }}
          >
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 6 }}
              >
                <View
                  style={{
                    padding: 4,
                    borderRadius: 12,
                    height: 33,
                    width: 33,
                    backgroundColor: theme.primaryLabel,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <MaterialCommunityIcons
                    size={20}
                    name="lightning-bolt-outline"
                    style={{ color: theme.text }}
                  />
                </View>
                <View>
                  <Text
                    style={{
                      color: theme.textSecondary,
                      fontSize: fontSize.xs,
                    }}
                  >
                    Level 24
                  </Text>
                  <Text style={{ color: theme.text }}>2,450 / 3,000 XP</Text>
                </View>
              </View>

              <View style={{ alignItems: "flex-end" }}>
                <Text
                  style={{ color: theme.textSecondary, fontSize: fontSize.xs }}
                >
                  To next level
                </Text>
                <Text
                  style={{
                    color: theme.primaryLabel,
                    fontWeight: fontWeight.bold,
                  }}
                >
                  550 XP
                </Text>
              </View>
            </View>

            <View
              style={{
                marginTop: 10,
                position: "relative",
                height: 8,
                overflow: "hidden",
                borderRadius: 16,
              }}
            >
              <View
                style={{
                  ...StyleSheet.absoluteFill,
                  backgroundColor: theme.surface,
                }}
              />

              <View
                style={{
                  ...StyleSheet.absoluteFill,
                  width: "60%",
                  backgroundColor: theme.primaryMuted,
                  borderRadius: 12,
                }}
              />

              <Animated.View
                style={{
                  ...StyleSheet.absoluteFill,
                  transform: [{ translateX }],
                  width: "100%",
                }}
              >
                <LinearGradient
                  colors={[
                    "transparent",
                    "rgba(255, 255, 255, 0.4)",
                    "transparent",
                  ]}
                  start={{ x: 0, y: 0 }} // [cite: 9]
                  end={{ x: 1, y: 0 }} // [cite: 9]
                  style={StyleSheet.absoluteFill}
                />
              </Animated.View>
            </View>
          </View>
          {/* {Platform.OS === "web" && <WebBadge />}
      </SafeAreaView> */}

          {/* Progress, generate & AI COACH */}
        </ThemedView>

        <View
          style={{
            padding: spacing.md,
            backgroundColor: theme.surface,
            borderRadius: 16,
            marginInline: 12,
            marginTop: 12,
            borderWidth: 1,
            borderColor: theme.elevated,
          }}
        >
          <View
            style={{
              justifyContent: "space-between",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <View>
              <Text
                style={{
                  fontSize: fontSize.md,
                  fontWeight: fontWeight.medium,
                  color: theme.text,
                }}
              >
                Daily Progress
              </Text>
              <Text style={{ fontSize: fontSize.sm, color: theme.textHint }}>
                0/5 quests completed
              </Text>
            </View>

            <Text
              style={{
                fontSize: fontSize.xl,
                color: theme.xpProgress,
                fontWeight: fontWeight.extrabold,
              }}
            >
              0%
            </Text>
          </View>

          <View
            style={{
              marginTop: 10,
              position: "relative",
              height: 8,
              overflow: "hidden",
              borderRadius: 16,
            }}
          >
            <View
              style={{
                ...StyleSheet.absoluteFill,
                backgroundColor: theme.xpProgress,
                borderRadius: 12,
                zIndex: 10,
                width: "40%",
              }}
            />

            <View
              style={{
                ...StyleSheet.absoluteFill,
                width: "100%",
                backgroundColor: theme.border,
                borderRadius: 12,
              }}
            />
          </View>
        </View>

        <View
          style={{
            padding: 10,
            flexDirection: "row",
            gap: 12,
            justifyContent: "center",
          }}
        >
          <View
            style={{
              padding: spacing.md,
              borderRadius: 16,
              backgroundColor: theme.primaryLabel,
              minWidth: 160,
            }}
          >
            <MaterialCommunityIcons
              name="generator-mobile"
              size={16}
              color={theme.text}
            />
            <Text
              style={{
                color: theme.text,
                fontWeight: fontWeight.bold,
                fontSize: fontSize.md,
              }}
            >
              Generate Quest
            </Text>
            <Text
              style={{
                color: theme.text,

                fontSize: fontSize.xs,
              }}
            >
              AI-powered daily
            </Text>
          </View>
          <View
            style={{
              padding: spacing.md,
              borderRadius: 16,
              backgroundColor: theme.xp,
              minWidth: 160,
            }}
          >
            <MaterialCommunityIcons
              name="badge-account-horizontal"
              size={16}
              color={theme.text}
            />
            <Text
              style={{
                color: theme.text,
                fontWeight: fontWeight.bold,
                fontSize: fontSize.md,
              }}
            >
              AI Coach
            </Text>
            <Text
              style={{
                color: theme.text,

                fontSize: fontSize.xs,
              }}
            >
              Get advice
            </Text>
          </View>
        </View>

        {/* List Quests */}
        <View style={{ marginInline: 16 }}>
          <ListTodayQuests />
        </View>
      </ScrollView>
    </>
  );
}
