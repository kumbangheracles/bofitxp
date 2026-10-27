import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useState,
} from "react";
type GlobalStateContextType = {
  isOpenModalBmi: boolean;
  setIsOpenModalBmi: Dispatch<SetStateAction<boolean>>;
  emailForOtp: string | null;
  setEmailForOtp: Dispatch<SetStateAction<string | null>>;
  pendingNewEmail: string | null;
  setPendingNewEmail: Dispatch<SetStateAction<string | null>>;
  pendingPassword: string | null;
  setPendingPassword: Dispatch<SetStateAction<string | null>>;
  currentPassword: string | null;
  setCurrentPassword: Dispatch<SetStateAction<string | null>>;
};

const GlobalStateContext = createContext<GlobalStateContextType | null>(null);

export function GlobalSatateProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isOpenModalBmi, setIsOpenModalBmi] = useState<boolean>(false);
  const [emailForOtp, setEmailForOtp] = useState<string | null>(null);
  const [pendingNewEmail, setPendingNewEmail] = useState<string | null>(null);
  const [pendingPassword, setPendingPassword] = useState<string | null>(null);
  const [currentPassword, setCurrentPassword] = useState<string | null>(null);

  return (
    <GlobalStateContext.Provider
      value={{
        isOpenModalBmi,
        setIsOpenModalBmi,
        emailForOtp,
        setEmailForOtp,
        pendingNewEmail,
        setPendingNewEmail,
        pendingPassword,
        setPendingPassword,
        currentPassword,
        setCurrentPassword,
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
