import * as SecureStore from "expo-secure-store";

export type CustomRoutine = {
  id: string;
  name: string;
  exercises: string[];
  xpReward: number;
  createdAt: string;
  completedAt?: string | null;
};

const CUSTOM_ROUTINES_KEY = "bofitxp_custom_routines";
const ACTIVE_CUSTOM_DAILY_ROUTINE_KEY = "bofitxp_active_custom_daily_routine";

export const getStoredCustomRoutines = async (): Promise<CustomRoutine[]> => {
  try {
    const saved = await SecureStore.getItemAsync(CUSTOM_ROUTINES_KEY);
    if (!saved) return [];

    const parsed = JSON.parse(saved) as CustomRoutine[];
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.warn("Failed to read custom routines:", error);
    return [];
  }
};

export const saveCustomRoutines = async (routines: CustomRoutine[]) => {
  try {
    await SecureStore.setItemAsync(
      CUSTOM_ROUTINES_KEY,
      JSON.stringify(routines),
    );
  } catch (error) {
    console.warn("Failed to save custom routines:", error);
  }
};

export const getSelectedDailyRoutineId = async (): Promise<string | null> => {
  try {
    return (
      (await SecureStore.getItemAsync(ACTIVE_CUSTOM_DAILY_ROUTINE_KEY)) ?? null
    );
  } catch (error) {
    console.warn("Failed to read active daily routine:", error);
    return null;
  }
};

export const setSelectedDailyRoutineId = async (id: string | null) => {
  try {
    if (!id) {
      await SecureStore.deleteItemAsync(ACTIVE_CUSTOM_DAILY_ROUTINE_KEY);
      return;
    }

    await SecureStore.setItemAsync(ACTIVE_CUSTOM_DAILY_ROUTINE_KEY, id);
  } catch (error) {
    console.warn("Failed to save active daily routine:", error);
  }
};
