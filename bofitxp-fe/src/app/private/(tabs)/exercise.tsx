import { AppTheme } from "@/constants/theme";
import { useAppTheme } from "@/hooks/use-app-theme";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useMemo, useState } from "react";
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import {
  CustomRoutine,
  getSelectedDailyRoutineId,
  getStoredCustomRoutines,
  saveCustomRoutines,
  setSelectedDailyRoutineId,
} from "@/utils/custom-routine";

type EquipmentType = "equipment" | "bodyweight";
type Difficulty = "beginner" | "intermediate" | "advanced";
type MuscleGroup =
  | "Otot kaki"
  | "Otot punggung"
  | "Otot dada"
  | "Otot perut"
  | "Otot tangan"
  | "Otot bahu"
  | "Glutes"
  | "Otot paha"
  | "Core";

type ExerciseItem = {
  id: string;
  name: string;
  category: EquipmentType;
  muscleGroups: MuscleGroup[];
  difficulty: Difficulty;
  description: string;
  defaultSets: number;
  defaultReps: string;
};

const exerciseCatalog: ExerciseItem[] = [
  {
    id: "barbell-squat",
    name: "Barbell Squat",
    category: "equipment",
    muscleGroups: ["Otot kaki", "Glutes", "Otot paha"],
    difficulty: "intermediate",
    description:
      "Squat compound yang menargetkan kaki, glutes, dan stabilitas inti.",
    defaultSets: 4,
    defaultReps: "8-12 reps",
  },
  {
    id: "bench-press",
    name: "Bench Press",
    category: "equipment",
    muscleGroups: ["Otot dada", "Otot tangan", "Otot bahu"],
    difficulty: "intermediate",
    description:
      "Latihan push utama untuk dada, bahu, dan triceps dengan kontrol penuh.",
    defaultSets: 4,
    defaultReps: "6-10 reps",
  },
  {
    id: "deadlift",
    name: "Deadlift",
    category: "equipment",
    muscleGroups: ["Otot punggung", "Glutes", "Otot kaki"],
    difficulty: "advanced",
    description:
      "Power lift lengkap untuk posterior chain, hamstring, dan kestabilan tulang belakang.",
    defaultSets: 5,
    defaultReps: "5-8 reps",
  },
  {
    id: "pull-up",
    name: "Pull Up",
    category: "equipment",
    muscleGroups: ["Otot punggung", "Otot tangan", "Otot bahu"],
    difficulty: "advanced",
    description:
      "Pull-up fokus pada back strength, grip, dan penguatan lengan atas.",
    defaultSets: 4,
    defaultReps: "6-12 reps",
  },
  {
    id: "dumbbell-row",
    name: "Dumbbell Row",
    category: "equipment",
    muscleGroups: ["Otot punggung", "Otot tangan", "Otot bahu"],
    difficulty: "beginner",
    description:
      "Row unilateral untuk memperkuat punggung dan menstabilkan torso.",
    defaultSets: 3,
    defaultReps: "10-15 reps",
  },
  {
    id: "plank",
    name: "Plank",
    category: "bodyweight",
    muscleGroups: ["Otot perut", "Core", "Otot punggung"],
    difficulty: "beginner",
    description:
      "Isometric core drill untuk stabilitas, postur, dan daya tahan inti.",
    defaultSets: 3,
    defaultReps: "30-60 detik",
  },
  {
    id: "push-up",
    name: "Push Up",
    category: "bodyweight",
    muscleGroups: ["Otot dada", "Otot tangan", "Otot bahu"],
    difficulty: "intermediate",
    description:
      "Variasi bodyweight untuk dada, bahu, dan triceps dengan kontrol tubuh.",
    defaultSets: 4,
    defaultReps: "10-20 reps",
  },
  {
    id: "lunges",
    name: "Lunges",
    category: "bodyweight",
    muscleGroups: ["Otot kaki", "Glutes", "Otot paha"],
    difficulty: "beginner",
    description:
      "Latihan unilateral untuk kaki dan glute serta keseimbangan tubuh.",
    defaultSets: 3,
    defaultReps: "12 reps / sisi",
  },
  {
    id: "mountain-climber",
    name: "Mountain Climber",
    category: "bodyweight",
    muscleGroups: ["Otot perut", "Core", "Otot kaki"],
    difficulty: "intermediate",
    description:
      "Kombinasi kardio dan core untuk burn kalori dan stabilitas tubuh.",
    defaultSets: 3,
    defaultReps: "20-30 detik",
  },
  {
    id: "reverse-crunch",
    name: "Reverse Crunch",
    category: "bodyweight",
    muscleGroups: ["Otot perut", "Core"],
    difficulty: "beginner",
    description: "Target abs bawah dan kontrol tubuh saat menekuk pinggul.",
    defaultSets: 3,
    defaultReps: "12-15 reps",
  },
  {
    id: "shoulder-press",
    name: "Shoulder Press",
    category: "equipment",
    muscleGroups: ["Otot bahu", "Otot tangan", "Core"],
    difficulty: "intermediate",
    description:
      "Focus pada stabilitas bahu dan kekuatan lengan atas untuk performa overhead.",
    defaultSets: 4,
    defaultReps: "8-12 reps",
  },
  {
    id: "bent-over-row",
    name: "Bent-Over Row",
    category: "equipment",
    muscleGroups: ["Otot punggung", "Otot bahu", "Otot tangan"],
    difficulty: "intermediate",
    description:
      "Posterior chain strength builder untuk punggung dan grip yang lebih kuat.",
    defaultSets: 4,
    defaultReps: "8-10 reps",
  },
];

const muscleGroups: Array<"all" | MuscleGroup> = [
  "all",
  "Otot kaki",
  "Otot punggung",
  "Otot dada",
  "Otot perut",
  "Otot tangan",
  "Otot bahu",
  "Glutes",
  "Core",
];

const categoryMeta: Record<"all" | EquipmentType, string> = {
  all: "Semua",
  equipment: "Dengan alat",
  bodyweight: "Tanpa alat",
};

const getDifficultyBoost = (difficulty: Difficulty) => {
  switch (difficulty) {
    case "beginner":
      return 12;
    case "intermediate":
      return 22;
    default:
      return 34;
  }
};

const getAiReward = (exercise: ExerciseItem) => {
  const base = exercise.category === "equipment" ? 45 : 32;
  const muscleBoost = exercise.muscleGroups.length * 6;
  const difficultyBoost = getDifficultyBoost(exercise.difficulty);
  const xp = base + muscleBoost + difficultyBoost;

  return {
    xp,
    label: `+${xp} XP`,
  };
};

export default function ExerciseScreen() {
  const theme = useAppTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const [selectedCategory, setSelectedCategory] = useState<
    "all" | EquipmentType
  >("all");
  const [selectedMuscle, setSelectedMuscle] = useState<"all" | MuscleGroup>(
    "all",
  );
  const [customName, setCustomName] = useState("Latihan Saya");
  const [selectedForCustom, setSelectedForCustom] = useState<string[]>([
    "barbell-squat",
    "plank",
  ]);
  const [customRoutines, setCustomRoutines] = useState<CustomRoutine[]>([]);
  const [activeRoutineId, setActiveRoutineId] = useState<string | null>(null);
  const [hasHydrated, setHasHydrated] = useState(false);

  useEffect(() => {
    const loadPersistedData = async () => {
      const storedRoutines = await getStoredCustomRoutines();
      const storedActiveId = await getSelectedDailyRoutineId();

      setCustomRoutines(storedRoutines);
      setActiveRoutineId(storedActiveId);
      setHasHydrated(true);
    };

    void loadPersistedData();
  }, []);

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

  const handleToggleDailyRoutine = (routineId: string) => {
    setActiveRoutineId((current) => {
      if (current === routineId) return current;
      return routineId;
    });
  };

  const filteredExercises = useMemo(() => {
    return exerciseCatalog.filter((exercise) => {
      const matchesCategory =
        selectedCategory === "all" || exercise.category === selectedCategory;
      const matchesMuscle =
        selectedMuscle === "all" ||
        exercise.muscleGroups.includes(selectedMuscle as MuscleGroup);

      return matchesCategory && matchesMuscle;
    });
  }, [selectedCategory, selectedMuscle]);

  const handleToggleCustomExercise = (exerciseId: string) => {
    setSelectedForCustom((current) => {
      if (current.includes(exerciseId)) {
        return current.filter((item) => item !== exerciseId);
      }

      return [...current, exerciseId];
    });
  };

  const handleCreateCustomRoutine = () => {
    if (!selectedForCustom.length) {
      return;
    }

    const routineReward = selectedForCustom.reduce((sum, id) => {
      const exercise = exerciseCatalog.find((item) => item.id === id);
      if (!exercise) return sum;
      return sum + getAiReward(exercise).xp;
    }, 0);

    const nextRoutine: CustomRoutine = {
      id: `routine-${Date.now()}`,
      name: customName.trim() || `Latihan ${customRoutines.length + 1}`,
      exercises: selectedForCustom,
      xpReward: routineReward,
      createdAt: new Date().toISOString(),
      completedAt: null,
    };

    setCustomRoutines((current) => [nextRoutine, ...current]);
    setSelectedForCustom([]);
    setCustomName("Latihan Saya");
    setActiveRoutineId(nextRoutine.id);
  };

  const totalReward = filteredExercises.reduce(
    (sum, item) => sum + getAiReward(item).xp,
    0,
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <LinearGradient
          colors={[theme.primary, theme.primaryHover]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.heroCard}
        >
          <View style={styles.heroHeader}>
            <View style={styles.iconWrap}>
              <MaterialCommunityIcons
                name="dumbbell"
                size={26}
                color={theme.surface}
              />
            </View>

            <View style={styles.heroTextWrap}>
              <Text style={styles.heroTitle}>Exercise</Text>
              <Text style={styles.heroSubtitle}>
                Semua latihan, dibagi berdasarkan alat dan target otot.
              </Text>
            </View>
          </View>

          <View style={styles.rewardSummary}>
            <Text style={styles.rewardLabel}>AI reward aktif</Text>
            <Text style={styles.rewardValue}>{totalReward} XP</Text>
          </View>
        </LinearGradient>

        <View style={styles.sectionWrap}>
          <Text style={styles.sectionTitle}>Kategori</Text>
          <View style={styles.filterRow}>
            {(["all", "equipment", "bodyweight"] as const).map((option) => (
              <Pressable
                key={option}
                onPress={() => setSelectedCategory(option)}
                style={[
                  styles.filterChip,
                  selectedCategory === option && styles.filterChipActive,
                ]}
              >
                <Text
                  style={[
                    styles.filterChipText,
                    selectedCategory === option && styles.filterChipTextActive,
                  ]}
                >
                  {categoryMeta[option]}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        <View style={styles.sectionWrap}>
          <Text style={styles.sectionTitle}>Target otot</Text>
          <View style={styles.filterRowWrap}>
            {muscleGroups.map((muscle) => {
              const active = selectedMuscle === muscle;
              return (
                <Pressable
                  key={muscle}
                  onPress={() => setSelectedMuscle(muscle)}
                  style={[styles.filterPill, active && styles.filterPillActive]}
                >
                  <Text
                    style={[
                      styles.filterPillText,
                      active && styles.filterPillTextActive,
                    ]}
                  >
                    {muscle === "all" ? "Semua" : muscle}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <View style={styles.sectionWrap}>
          <Text style={styles.sectionTitle}>Daftar exercise</Text>

          {filteredExercises.map((exercise) => {
            const reward = getAiReward(exercise);
            const isSelected = selectedForCustom.includes(exercise.id);

            return (
              <View key={exercise.id} style={styles.card}>
                <View style={styles.cardHeader}>
                  <View style={styles.cardTitleWrap}>
                    <Text style={styles.exerciseName}>{exercise.name}</Text>
                    <Text style={styles.exerciseType}>
                      {exercise.category === "equipment"
                        ? "Dengan alat"
                        : "Tanpa alat"}
                    </Text>
                  </View>

                  <Pressable
                    onPress={() => handleToggleCustomExercise(exercise.id)}
                    style={[
                      styles.toggleButton,
                      isSelected && styles.toggleButtonActive,
                    ]}
                  >
                    <Text style={styles.toggleButtonText}>
                      {isSelected ? "Terpilih" : "Tambah"}
                    </Text>
                  </Pressable>
                </View>

                <Text style={styles.exerciseDescription}>
                  {exercise.description}
                </Text>

                <View style={styles.muscleRow}>
                  {exercise.muscleGroups.map((muscle) => (
                    <View
                      key={`${exercise.id}-${muscle}`}
                      style={styles.muscleChip}
                    >
                      <Text style={styles.muscleChipText}>{muscle}</Text>
                    </View>
                  ))}
                </View>

                <View style={styles.metaRow}>
                  <Text style={styles.metaText}>
                    Level: {exercise.difficulty}
                  </Text>
                  <Text style={styles.metaText}>
                    {exercise.defaultSets} sets · {exercise.defaultReps}
                  </Text>
                </View>

                <View style={styles.rewardRow}>
                  <Text style={styles.rewardChipText}>AI reward</Text>
                  <Text style={styles.rewardChipValue}>{reward.label}</Text>
                </View>
              </View>
            );
          })}
        </View>

        <View style={styles.sectionWrap}>
          <Text style={styles.sectionTitle}>Custom workout</Text>

          <TextInput
            value={customName}
            onChangeText={setCustomName}
            placeholder="Nama latihan custom"
            placeholderTextColor={theme.textHint}
            style={styles.input}
          />

          <View style={styles.customSelection}>
            {selectedForCustom.length ? (
              selectedForCustom.map((id) => {
                const item = exerciseCatalog.find(
                  (exercise) => exercise.id === id,
                );

                if (!item) return null;

                return (
                  <View key={id} style={styles.customTag}>
                    <Text style={styles.customTagText}>{item.name}</Text>
                  </View>
                );
              })
            ) : (
              <Text style={styles.emptyText}>
                Pilih exercise untuk dibangun jadi routine.
              </Text>
            )}
          </View>

          <Pressable
            onPress={handleCreateCustomRoutine}
            style={styles.primaryButton}
          >
            <Text style={styles.primaryButtonText}>Buat custom routine</Text>
          </Pressable>
        </View>

        <View style={styles.sectionWrap}>
          <Text style={styles.sectionTitle}>Routine tersimpan</Text>

          {customRoutines.map((routine) => {
            const isActive = activeRoutineId === routine.id;
            const routineReward = routine.exercises.reduce(
              (sum, exerciseId) => {
                const item = exerciseCatalog.find(
                  (exercise) => exercise.id === exerciseId,
                );
                if (!item) return sum;
                return sum + getAiReward(item).xp;
              },
              0,
            );

            return (
              <View key={routine.id} style={styles.routineCard}>
                <View style={styles.routineHeader}>
                  <Text style={styles.routineTitle}>{routine.name}</Text>
                  <Text style={styles.routineXp}>+{routineReward} XP</Text>
                </View>

                <View style={styles.muscleRow}>
                  {routine.exercises.map((exerciseId) => {
                    const item = exerciseCatalog.find(
                      (exercise) => exercise.id === exerciseId,
                    );

                    if (!item) return null;

                    return (
                      <View
                        key={`${routine.id}-${exerciseId}`}
                        style={styles.muscleChip}
                      >
                        <Text style={styles.muscleChipText}>{item.name}</Text>
                      </View>
                    );
                  })}
                </View>

                <Pressable
                  onPress={() => handleToggleDailyRoutine(routine.id)}
                  style={[
                    styles.secondaryButton,
                    isActive && styles.secondaryButtonActive,
                  ]}
                >
                  <Text style={styles.secondaryButtonText}>
                    {isActive
                      ? "Daily quest aktif"
                      : "Pakai sebagai daily quest"}
                  </Text>
                </Pressable>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: theme.background,
    },
    content: {
      paddingHorizontal: 16,
      paddingVertical: 16,
      paddingBottom: 100,
    },
    heroCard: {
      borderRadius: 24,
      padding: 18,
      marginBottom: 18,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.18,
      shadowRadius: 18,
      elevation: 6,
    },
    heroHeader: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
    },
    iconWrap: {
      width: 52,
      height: 52,
      borderRadius: 16,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "rgba(255,255,255,0.18)",
    },
    heroTextWrap: {
      flex: 1,
    },
    heroTitle: {
      fontSize: 28,
      fontWeight: "700",
      color: theme.surface,
    },
    heroSubtitle: {
      marginTop: 4,
      fontSize: 13,
      color: "rgba(255,255,255,0.8)",
    },
    rewardSummary: {
      marginTop: 18,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      padding: 12,
      borderRadius: 14,
      backgroundColor: "rgba(255,255,255,0.14)",
    },
    rewardLabel: {
      fontSize: 12,
      color: "rgba(255,255,255,0.8)",
      fontWeight: "600",
    },
    rewardValue: {
      fontSize: 18,
      fontWeight: "700",
      color: theme.surface,
    },
    sectionWrap: {
      marginBottom: 18,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: "700",
      color: theme.text,
      marginBottom: 10,
    },
    filterRow: {
      flexDirection: "row",
      gap: 10,
    },
    filterChip: {
      flex: 1,
      paddingVertical: 10,
      borderRadius: 12,
      alignItems: "center",
      backgroundColor: theme.surfaceAlt,
      borderWidth: 1,
      borderColor: theme.border,
    },
    filterChipActive: {
      backgroundColor: theme.primarySoft,
      borderColor: theme.primary,
    },
    filterChipText: {
      fontSize: 12,
      fontWeight: "600",
      color: theme.textSecondary,
    },
    filterChipTextActive: {
      color: theme.primary,
    },
    filterRowWrap: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 8,
    },
    filterPill: {
      paddingVertical: 8,
      paddingHorizontal: 10,
      borderRadius: 999,
      borderWidth: 1,
      borderColor: theme.border,
      backgroundColor: theme.surfaceAlt,
    },
    filterPillActive: {
      backgroundColor: theme.primarySoft,
      borderColor: theme.primary,
    },
    filterPillText: {
      fontSize: 12,
      fontWeight: "600",
      color: theme.textSecondary,
    },
    filterPillTextActive: {
      color: theme.primary,
    },
    card: {
      backgroundColor: theme.surfaceAlt,
      borderRadius: 18,
      padding: 16,
      borderWidth: 1,
      borderColor: theme.border,
      marginBottom: 12,
    },
    cardHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
      gap: 12,
    },
    cardTitleWrap: {
      flex: 1,
    },
    exerciseName: {
      fontSize: 18,
      fontWeight: "700",
      color: theme.text,
      marginBottom: 4,
    },
    exerciseType: {
      fontSize: 11,
      color: theme.textHint,
      fontWeight: "600",
    },
    toggleButton: {
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 10,
      backgroundColor: theme.elevated,
      borderWidth: 1,
      borderColor: theme.border,
    },
    toggleButtonActive: {
      backgroundColor: theme.primarySoft,
      borderColor: theme.primary,
    },
    toggleButtonText: {
      fontSize: 11,
      fontWeight: "700",
      color: theme.text,
    },
    exerciseDescription: {
      fontSize: 13,
      color: theme.textSecondary,
      marginTop: 10,
      lineHeight: 18,
    },
    muscleRow: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 8,
      marginTop: 12,
    },
    muscleChip: {
      backgroundColor: theme.primarySoft,
      paddingHorizontal: 10,
      paddingVertical: 6,
      borderRadius: 999,
      borderWidth: 1,
      borderColor: theme.primary,
    },
    muscleChipText: {
      fontSize: 10,
      fontWeight: "700",
      color: theme.primaryLabel,
    },
    metaRow: {
      marginTop: 14,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      gap: 10,
    },
    metaText: {
      fontSize: 11,
      color: theme.textHint,
      fontWeight: "600",
    },
    rewardRow: {
      marginTop: 16,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: 10,
      paddingHorizontal: 12,
      borderRadius: 12,
      backgroundColor: theme.background,
      borderWidth: 1,
      borderColor: theme.border,
    },
    rewardChipText: {
      fontSize: 11,
      color: theme.textHint,
      fontWeight: "700",
    },
    rewardChipValue: {
      fontSize: 13,
      fontWeight: "700",
      color: theme.xp,
    },
    input: {
      backgroundColor: theme.surfaceAlt,
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 12,
      paddingHorizontal: 14,
      paddingVertical: 12,
      color: theme.text,
      fontSize: 14,
      marginBottom: 12,
    },
    customSelection: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 8,
      minHeight: 34,
      marginBottom: 12,
    },
    customTag: {
      backgroundColor: theme.primarySoft,
      paddingHorizontal: 10,
      paddingVertical: 7,
      borderRadius: 999,
      borderWidth: 1,
      borderColor: theme.primary,
    },
    customTagText: {
      fontSize: 11,
      fontWeight: "600",
      color: theme.primaryLabel,
    },
    emptyText: {
      fontSize: 12,
      color: theme.textHint,
      fontStyle: "italic",
    },
    primaryButton: {
      backgroundColor: theme.primary,
      borderRadius: 12,
      paddingVertical: 12,
      alignItems: "center",
      justifyContent: "center",
    },
    primaryButtonText: {
      color: theme.surface,
      fontSize: 14,
      fontWeight: "700",
    },
    routineCard: {
      backgroundColor: theme.surfaceAlt,
      borderRadius: 16,
      padding: 14,
      borderWidth: 1,
      borderColor: theme.border,
      marginBottom: 10,
    },
    routineHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      gap: 10,
      marginBottom: 8,
    },
    routineTitle: {
      fontSize: 15,
      fontWeight: "700",
      color: theme.text,
      flex: 1,
    },
    routineXp: {
      fontSize: 12,
      fontWeight: "700",
      color: theme.xp,
    },
    secondaryButton: {
      marginTop: 12,
      borderRadius: 10,
      paddingVertical: 10,
      alignItems: "center",
      backgroundColor: theme.elevated,
      borderWidth: 1,
      borderColor: theme.border,
    },
    secondaryButtonActive: {
      backgroundColor: theme.primarySoft,
      borderColor: theme.primary,
    },
    secondaryButtonText: {
      fontSize: 12,
      fontWeight: "700",
      color: theme.text,
    },
  });
