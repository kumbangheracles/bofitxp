import { fontSize, fontWeight } from "@/constants/theme";
import { useAppTheme } from "@/hooks/use-app-theme";
import { Pressable, ScrollView, Text, View } from "react-native";
import Checkbox from "expo-checkbox";

import { useCallback, useEffect, useState } from "react";
import { useSharedValue, withTiming } from "react-native-reanimated";
import { useFocusEffect } from "expo-router";
import { showSuccess } from "@/utils/toast";
import QuestCard from "../QuestCard";
import useUserQuests from "@/hooks/use-user-quests";
import { QuestCategory, QuestsProperties } from "@/types/quests.type";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Loader from "../ui/loaders";
import { useAuth } from "@/context/AuthContext";
import {
  CustomRoutine,
  getSelectedDailyRoutineId,
  getStoredCustomRoutines,
  saveCustomRoutines,
  setSelectedDailyRoutineId,
} from "@/utils/custom-routine";

const getExerciseLabel = (exerciseId: string) =>
  exerciseId
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

const ListTodayQuests = () => {
  const theme = useAppTheme();
  const { authUser, setAuthUser } = useAuth();
  const [checked, _] = useState<boolean>(false);
  const [customRoutines, setCustomRoutines] = useState<CustomRoutine[]>([]);
  const [activeRoutineId, setActiveRoutineId] = useState<string | null>(null);
  const [hasHydrated, setHasHydrated] = useState(false);
  const [routineExerciseChecks, setRoutineExerciseChecks] = useState<
    Record<string, boolean>
  >({});
  const {
    data: dataQuests,
    isError,
    isFetched,
    isPending,
    refetch,
    error,
  } = useUserQuests({ questCategory: QuestCategory?.DAILY });

  // useEffect(() => {
  //   console.log("Data quests: ", dataQuests);
  // }, [dataQuests]);
  const progress = useSharedValue(0);
  useEffect(() => {
    progress.value = withTiming(checked ? 1 : 0, {
      duration: 50,
    });
  }, [checked]);

  // useEffect(() => {
  //   Toast.show({
  //     type: "error",
  //     text1: "Error get data quests",
  //     text2: error?.message,
  //   });
  // }, [error?.message !== undefined]);
  useFocusEffect(
    useCallback(() => {
      const readStoredRoutines = async () => {
        const stored = await getStoredCustomRoutines();
        const activeId = await getSelectedDailyRoutineId();

        setCustomRoutines(stored);
        setActiveRoutineId(activeId);
        setHasHydrated(true);
      };

      void readStoredRoutines();
    }, []),
  );

  useEffect(() => {
    if (!hasHydrated) return;
    void saveCustomRoutines(customRoutines);
  }, [customRoutines, hasHydrated]);

  useEffect(() => {
    if (!hasHydrated) return;
    void setSelectedDailyRoutineId(activeRoutineId);
  }, [activeRoutineId, hasHydrated]);

  useEffect(() => {
    if (!activeRoutineId) return;

    if (!customRoutines.some((routine) => routine.id === activeRoutineId)) {
      setActiveRoutineId(null);
    }
  }, [activeRoutineId, customRoutines]);

  const activeRoutine =
    customRoutines.find((routine) => routine.id === activeRoutineId) ?? null;

  const isCustomRoutineComplete =
    !!activeRoutine &&
    activeRoutine.exercises.length > 0 &&
    activeRoutine.exercises.every(
      (exerciseId) => !!routineExerciseChecks[exerciseId],
    );

  useEffect(() => {
    if (!activeRoutine) return;

    setRoutineExerciseChecks((prev) => {
      const next: Record<string, boolean> = { ...prev };

      for (const exerciseId of activeRoutine.exercises) {
        if (!(exerciseId in next)) {
          next[exerciseId] = false;
        }
      }

      return next;
    });
  }, [activeRoutine?.id]);

  useEffect(() => {
    if (
      !activeRoutine ||
      activeRoutine.completedAt ||
      !isCustomRoutineComplete
    ) {
      return;
    }

    void handleCompleteCustomRoutine();
  }, [activeRoutine, isCustomRoutineComplete]);

  const toggleRoutineExercise = (exerciseId: string) => {
    setRoutineExerciseChecks((prev) => ({
      ...prev,
      [exerciseId]: !prev[exerciseId],
    }));
  };

  const handleCompleteCustomRoutine = async () => {
    if (!activeRoutine || activeRoutine.completedAt) return;

    const reward = activeRoutine.xpReward;

    setAuthUser((prev) =>
      prev
        ? {
            ...prev,
            xp: (prev.xp ?? 0) + reward,
          }
        : prev,
    );

    const updated = customRoutines.map((routine) =>
      routine.id === activeRoutine.id
        ? { ...routine, completedAt: new Date().toISOString() }
        : routine,
    );

    setCustomRoutines(updated);
    showSuccess("Custom routine selesai", `+${reward} XP`);
  };

  const showToast = (exp: number) => {
    showSuccess("Workout selesai", `+${exp} XP`);
  };

  return (
    <ScrollView style={{ width: "100%" }}>
      <View
        style={{
          marginBlock: 10,
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <Text
          style={{
            fontSize: fontSize.lg,
            fontWeight: fontWeight.bold,
            color: theme.text,
          }}
        >
          Today's Quests
        </Text>
        {/* <Text
          style={{
            fontSize: fontSize.md,
            color: theme.primaryLabel,
            fontWeight: fontWeight.medium,
          }}
        >
          View All {">"}
        </Text> */}
      </View>
      {/* Loading */}
      {isPending && (
        <View
          style={{
            padding: 20,
            borderRadius: 16,
            backgroundColor: theme.background,
            justifyContent: "center",
            alignItems: "center",
            gap: 4,
          }}
        >
          <Loader />
        </View>
      )}

      {activeRoutine && (
        <View
          style={{
            marginBottom: 12,
            padding: 16,
            borderRadius: 18,
            backgroundColor: theme.surface,
            borderWidth: 1,
            borderColor: theme.primary,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 8,
            }}
          >
            <Text
              style={{
                fontSize: 13,
                fontWeight: fontWeight.bold,
                color: theme.primaryLabel,
              }}
            >
              Custom Daily Quest
            </Text>
            <Text
              style={{
                fontSize: 12,
                fontWeight: fontWeight.bold,
                color: theme.xp,
              }}
            >
              +{activeRoutine.xpReward} XP
            </Text>
          </View>

          <Text
            style={{
              fontSize: 18,
              fontWeight: fontWeight.bold,
              color: theme.text,
            }}
          >
            {activeRoutine.name}
          </Text>

          <Text style={{ marginTop: 8, color: theme.textSecondary }}>
            {activeRoutine.exercises.length} latihan
          </Text>

          <View style={{ marginTop: 12, gap: 8 }}>
            {activeRoutine.exercises.map((exerciseId) => {
              const isChecked = !!routineExerciseChecks[exerciseId];

              return (
                <Pressable
                  key={`${activeRoutine.id}-${exerciseId}`}
                  onPress={() => toggleRoutineExercise(exerciseId)}
                  style={{
                    gap: 8,
                    position: "relative",
                  }}
                >
                  <View
                    style={{
                      padding: 16,
                      backgroundColor: theme.surface,
                      borderRadius: 16,
                      marginTop: 2,
                      borderWidth: 1,
                      borderColor: isChecked ? theme.xpProgress : theme.border,
                      flexDirection: "row",
                      gap: 8,
                    }}
                  >
                    <Checkbox
                      style={{
                        borderRadius: 12,
                        borderColor: theme.textHint,
                      }}
                      value={isChecked}
                      onValueChange={() => toggleRoutineExercise(exerciseId)}
                      color={theme.xpProgress}
                    />
                    <View style={{ flex: 1 }}>
                      <Text
                        style={{
                          fontSize: 15,
                          color: theme.text,
                          textDecorationLine: isChecked
                            ? "line-through"
                            : "none",
                          fontWeight: fontWeight.semibold,
                        }}
                      >
                        {getExerciseLabel(exerciseId)}
                      </Text>

                      <View
                        style={{
                          flexDirection: "row",
                          gap: 8,
                          alignItems: "center",
                          marginTop: 8,
                          flexWrap: "wrap",
                        }}
                      >
                        <View
                          style={{
                            paddingHorizontal: 8,
                            paddingVertical: 4,
                            borderRadius: 16,
                            borderColor: theme.primary,
                            backgroundColor: theme.primarySoft,
                            borderWidth: 1,
                          }}
                        >
                          <Text
                            style={{ fontSize: 11, color: theme.primaryLabel }}
                          >
                            Custom
                          </Text>
                        </View>

                        <View
                          style={{
                            paddingHorizontal: 8,
                            paddingVertical: 4,
                            borderRadius: 16,
                            backgroundColor: theme.successSoft,
                            borderColor: theme.xpProgress,
                            borderWidth: 1,
                          }}
                        >
                          <Text
                            style={{ fontSize: 11, color: theme.successStrong }}
                          >
                            +
                            {Math.max(
                              10,
                              Math.round(
                                activeRoutine.xpReward /
                                  Math.max(activeRoutine.exercises.length, 1),
                              ),
                            )}
                            XP
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>
                </Pressable>
              );
            })}
          </View>

          <Pressable
            onPress={handleCompleteCustomRoutine}
            disabled={!!activeRoutine.completedAt}
            style={{
              marginTop: 12,
              paddingVertical: 10,
              borderRadius: 12,
              backgroundColor: activeRoutine.completedAt
                ? theme.background
                : theme.primary,
              alignItems: "center",
            }}
          >
            <Text
              style={{
                color: activeRoutine.completedAt
                  ? theme.textHint
                  : theme.surface,
                fontWeight: fontWeight.bold,
              }}
            >
              {activeRoutine.completedAt
                ? "Custom routine sudah selesai"
                : "Selesaikan custom routine"}
            </Text>
          </Pressable>
        </View>
      )}

      {/* Empty */}
      {isFetched &&
        !isPending &&
        dataQuests?.length === 0 &&
        !activeRoutine && (
          <View
            style={{
              padding: 20,
              borderRadius: 16,
              // borderColor: theme.textHint,
              borderWidth: 1,
              backgroundColor: theme.background,
              justifyContent: "center",
              alignItems: "center",
              gap: 4,
            }}
          >
            <MaterialCommunityIcons
              color={theme.textHint}
              name="database-off"
              size={24}
            />
            <Text style={{ color: theme.textHint }}>No quests available</Text>
          </View>
        )}
      {/* Quest List */}
      <View style={{ paddingBottom: 12 }}>
        {dataQuests?.map((item: QuestsProperties, index: number) => (
          <QuestCard
            refetch={refetch}
            key={item.id}
            item={item}
            index={index}
            showToast={() => showToast(item?.quest?.xp_reward)}
          />
        ))}
      </View>
    </ScrollView>
  );
};

export default ListTodayQuests;
