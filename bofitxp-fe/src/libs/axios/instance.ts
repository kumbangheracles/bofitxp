import environtment from "@/constants/environtments";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";

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
    const { isAuthenticated, token } = await useAuth();
    if (isAuthenticated && token) {
      request.headers.Authorization = `Bearer ${token}`;
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
