import AppInput from "@/components/app-input";
import AppModal from "@/components/app-modal";
import BmiClassificationCard from "@/components/BmiClassificationCard";
import { useAppTheme } from "@/hooks/use-app-theme";
import useUpdateUser from "@/hooks/use-update-user";
import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useState,
} from "react";
import { Controller } from "react-hook-form";
import { View, Text } from "react-native";
import { useAuth } from "./AuthContext";
type GlobalStateContextType = {
  isOpenModalBmi: boolean;
  setIsOpenModalBmi: Dispatch<SetStateAction<boolean>>;
};

const GlobalStateContext = createContext<GlobalStateContextType | null>(null);

export function GlobalSatateProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isOpenModalBmi, setIsOpenModalBmi] = useState<boolean>(false);

  return (
    <GlobalStateContext.Provider
      value={{
        isOpenModalBmi,
        setIsOpenModalBmi,
      }}
    >
      {children}
    </GlobalStateContext.Provider>
  );
}

export const useGlobalState = () => {
  const ctx = useContext(GlobalStateContext);
  if (!ctx) throw new Error("useGlobalState must be used within AuthProvider");
  return ctx;
};
