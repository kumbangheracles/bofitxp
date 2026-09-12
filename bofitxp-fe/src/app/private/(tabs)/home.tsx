import {
  Animated,
  StyleSheet,
  Text,
  View,
  Dimensions,
  ScrollView,
  Pressable,
} from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { fontSize, fontWeight, spacing } from "@/constants/theme";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useAppTheme } from "@/hooks/use-app-theme";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useMemo, useRef, useState } from "react";
import ListTodayQuests from "@/components/Home/ListTodayQuests";
import { router } from "expo-router";
import { usePressScale } from "@/hooks/use-press-scale";
import { useAuth } from "@/context/AuthContext";
import useUserQuests from "@/hooks/use-user-quests";
import { QuestCategory, QuestsProperties } from "@/types/quests.type";
import { getLevelThreshold } from "@/helpers/xp";
const { width } = Dimensions.get("window");
export default function index() {
  const { authUser } = useAuth();
  const theme = useAppTheme();
  const translateX = useRef(new Animated.Value(-width)).current;
  const { data: listDailyQuest } = useUserQuests({
    questCategory: QuestCategory?.DAILY,
  });
  const level = authUser?.level ?? 0;
  const xp = authUser?.xp ?? 0;

  const currentLevelXp = getLevelThreshold(level);
  const nextLevelXp = getLevelThreshold(level + 1);

  const progress = Math.min(
    1,
    Math.max(0, (xp - currentLevelXp) / (nextLevelXp - currentLevelXp)),
  );
  console.log({
    level,
    xp,
    currentLevelXp,
    nextLevelXp,
    progress,
    percentage: `${progress * 100}%`,
  });
  const scaleQuest = usePressScale();
  const scaleCoach = usePressScale();
  const completedQuests = listDailyQuest?.filter(
    (item: QuestsProperties) => item.is_finished === true,
  );
  const dailyProgress = useMemo(() => {
    const total = listDailyQuest?.length ?? 0;
    const completed = completedQuests?.length ?? 0;

    if (total === 0) {
      return {
        total: 0,
        completed: 0,
        percentage: 0,
      };
    }

    return {
      total,
      completed,
      percentage: Math.round((completed / total) * 100),
    };
  }, [listDailyQuest, completedQuests]);
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
      label: `${authUser?.streak} Days`,
      icon: (
        <MaterialCommunityIcons name="fire" size={13} color={theme.combo} />
      ),
    },
    {
      id: 2,
      title: "Total XP",
      label: authUser?.xp?.toLocaleString("id-ID"),
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
      label: authUser?.level,
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
                  onPress={() => router.push("/private/(tabs)/account")}
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
                    Level {authUser?.level}
                  </Text>
                  <Text style={{ color: theme.text }}>
                    {authUser?.xp} / {nextLevelXp} XP
                  </Text>
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
                  {nextLevelXp - (authUser?.xp ?? 0)} XP
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
              {/* Background */}
              <View
                style={{
                  ...StyleSheet.absoluteFill,
                  backgroundColor: theme.surface,
                }}
              />

              {/* Progress */}
              <View
                style={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  bottom: 0,
                  width: `${progress * 100}%`,
                  backgroundColor: theme.primaryMuted,
                  borderRadius: 12,
                }}
              />

              {/* Shine */}
              <Animated.View
                style={{
                  position: "absolute",
                  top: 0,
                  bottom: 0,
                  width: "100%",
                  transform: [{ translateX }],
                }}
              >
                <LinearGradient
                  colors={[
                    "transparent",
                    "rgba(255, 255, 255, 0.4)",
                    "transparent",
                  ]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
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
                {dailyProgress.completed}/{dailyProgress.total} quests completed
              </Text>
            </View>

            <Text
              style={{
                fontSize: fontSize.xl,
                color: theme.xpProgress,
                fontWeight: fontWeight.extrabold,
              }}
            >
              {dailyProgress?.percentage}%
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
                width: `${dailyProgress.percentage}%`,
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
          <Pressable
            onPress={() => router.push("/private/quests")}
            onPressIn={scaleQuest.onPressIn}
            onPressOut={scaleQuest.onPressOut}
          >
            <Animated.View style={scaleQuest.pressScaleStyle}>
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
            </Animated.View>
          </Pressable>
          <Pressable
            // onPress={() => router.push("/private/quests")}
            onPressIn={scaleCoach.onPressIn}
            onPressOut={scaleCoach.onPressOut}
          >
            <Animated.View style={scaleCoach.pressScaleStyle}>
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
            </Animated.View>
          </Pressable>
        </View>

        {/* List Quests */}
        <View style={{ marginInline: 16 }}>
          <ListTodayQuests />
        </View>
      </ScrollView>
    </>
  );
}
