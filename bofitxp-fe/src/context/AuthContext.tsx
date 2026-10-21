import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import * as SecureStore from "expo-secure-store";
import { jwtDecode } from "jwt-decode";
import { UserProps } from "@/types/user.type";
type AuthContextType = {
  isAuthenticated: boolean;
  isLoading: boolean;
  token: string | null;
  login: (token: string) => Promise<void>;
  logout: () => Promise<void>;
  authUser: UserProps | null;
  setAuthUser: Dispatch<SetStateAction<UserProps | null>>;
};

interface JWTDecode extends UserProps {
  exp?: number;
}

const isTokenExpired = (jwtToken: string) => {
  try {
    const decoded = jwtDecode<JWTDecode>(jwtToken);
    if (typeof decoded.exp !== "number") {
      return true;
    }

    return decoded.exp <= Date.now() / 1000;
  } catch (error) {
    console.error("Invalid token format:", error);
    return true;
  }
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authUser, setAuthUser] = useState<UserProps | null>(null);

  useEffect(() => {
    SecureStore.getItemAsync("user_token").then((storedToken) => {
      if (!storedToken) {
        setToken(null);
        setAuthUser(null);
        setIsLoading(false);
        return;
      }

      if (isTokenExpired(storedToken)) {
        void logout();
      } else {
        setToken(storedToken);
      }

      setIsLoading(false);
    });
  }, []);

  const login = async (newToken: string) => {
    await SecureStore.setItemAsync("user_token", newToken);
    setToken(newToken);
  };

  const logout = async () => {
    await SecureStore.deleteItemAsync("user_token");
    setToken(null);
    setAuthUser(null);
  };

  useEffect(() => {
    if (!token) {
      setAuthUser(null);
      return;
    }

    const checkExpiry = async () => {
      if (isTokenExpired(token)) {
        console.warn("Token has expired");
        await logout();
        return;
      }

      try {
        const decoded = jwtDecode<JWTDecode>(token);
        setAuthUser(decoded);
        console.log("Decoded token:", decoded);
      } catch (error) {
        console.error("Invalid token format:", error);
        await logout();
      }
    };

    void checkExpiry();
    const interval = setInterval(() => {
      void checkExpiry();
    }, 30_000);

    return () => clearInterval(interval);
  }, [token]);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!token,
        isLoading,
        token,
        login,
        logout,
        authUser,
        setAuthUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
