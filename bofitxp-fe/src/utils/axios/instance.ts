import environtment from "@/constants/environtments";
import axios from "axios";
import * as SecureStore from "expo-secure-store"; // <-- Impor storage kamu

const headers = {
  "Content-Type": "application/json",
};

const instance = axios.create({
  baseURL: environtment.EXPO_BASE_URL,
  headers,
  timeout: 60 * 1000,
});

instance.interceptors.request.use(
  async (request) => {
    console.log("API_URL: ", environtment.EXPO_BASE_URL);

    try {
      // 1. Ambil token langsung dari SecureStore secara async
      const token = await SecureStore.getItemAsync("user_token"); // Sesuaikan key penyimpananmu

      // 2. Jika token ada, langsung pasang ke header
      if (token) {
        request.headers.Authorization = `Bearer ${token}`;
        console.log("Token berhasil dipasang ke header: ", token);
      }
    } catch (error) {
      console.log("Gagal mengambil token dari storage:", error);
    }

    return request;
  },
  (error) => Promise.reject(error),
);

instance.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error),
);

export default instance;
