import React, { createContext, useContext, useState, ReactNode } from "react";

type ToastType = "success" | "error" | "info";

interface ToastContextType {
  visible: boolean;
  message: string;
  subtitle?: string;
  type: ToastType;
  showToast: (message: string, subtitle?: string, type?: ToastType) => void;
  hideToast: () => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const CustomToastProvider = ({ children }: { children: ReactNode }) => {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState("");
  const [subtitle, setSubtitle] = useState<string | undefined>(undefined);
  const [type, setType] = useState<ToastType>("success");

  const showToast = (msg: string, sub?: string, t: ToastType = "success") => {
    setMessage(msg);
    setSubtitle(sub);
    setType(t);
    setVisible(true);

    setTimeout(() => {
      setVisible(false);
    }, 2500);
  };

  const hideToast = () => {
    setVisible(false);
  };

  return (
    <ToastContext.Provider
      value={{ visible, message, subtitle, type, showToast, hideToast }}
    >
      {children}
    </ToastContext.Provider>
  );
};

export const useCustomToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast harus digunakan di dalam ToastProvider");
  }
  return context;
};
