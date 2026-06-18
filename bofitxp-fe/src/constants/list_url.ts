import { Platform } from "react-native";

export const API_URL =
  Platform.OS === "web"
    ? process.env.EXPO_PUBLIC_API_URL
    : "exp://192.168.1.2:8081/api";
