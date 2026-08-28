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
  expiresIn: number;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authUser, setAuthUser] = useState<UserProps | null>(null);
  useEffect(() => {
    SecureStore.getItemAsync("user_token").then((t) => {
      setToken(t);
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
  };

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode<JWTDecode>(token);

        const currentTime = Date.now() / 1000;
        if (decoded.expiresIn < currentTime) {
          console.warn("Token has expired");
          localStorage.removeItem("token");
          setAuthUser(null);

          console.log("Decoded: ", decoded);
        } else {
          setAuthUser(decoded);
        }
      } catch (error) {
        console.error("Invalid token format:", error);
      }
    }
  }, []);

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
