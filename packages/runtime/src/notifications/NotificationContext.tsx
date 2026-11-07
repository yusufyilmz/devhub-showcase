import { createContext, useContext } from "react";

export interface NotificationContextProps {
  close: () => void;
  notification: {
    message: string;
    open: boolean;
    severity: NotificationType;
  };
  showError: (message: string) => void;
  showInfo: (message: string) => void;
  showSuccess: (message: string) => void;
  showWarning: (message: string) => void;
}

export type NotificationType = "success" | "error" | "warning" | "info";

export const NotificationContext = createContext<NotificationContextProps | undefined>(undefined);

export const useNotification = (): NotificationContextProps => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotification must be used within a NotificationProvider");
  }
  return context;
};
