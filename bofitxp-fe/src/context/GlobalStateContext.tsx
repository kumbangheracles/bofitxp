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
