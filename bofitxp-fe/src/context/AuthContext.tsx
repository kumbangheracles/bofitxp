import { createContext, useContext, useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";

type AuthContextType = {
  isAuthenticated: boolean;
  isLoading: boolean;
  token: string | null;
  login: (token: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!token,
        isLoading,
        token,
        login,
        logout,
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
