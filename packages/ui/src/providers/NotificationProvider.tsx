"use client";

import type React from "react";
import { useCallback, useState } from "react";

import { NotificationContext, type NotificationType } from "@shared/runtime/notifications";

import { SnackbarNotification } from "../feedback/notification";
import type { NotificationProviderProps } from "./types";

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const [notification, setNotification] = useState({
    message: "",
    open: false,
    severity: "success" as NotificationType,
  });

  const showError = useCallback((message: string) => {
    setNotification({ message, open: true, severity: "error" });
  }, []);

  const showSuccess = useCallback((message: string) => {
    setNotification({ message, open: true, severity: "success" });
  }, []);

  const showInfo = useCallback((message: string) => {
    setNotification({ message, open: true, severity: "info" });
  }, []);

  const showWarning = useCallback((message: string) => {
    setNotification({ message, open: true, severity: "warning" });
  }, []);

  const handleClose = () => {
    setNotification((prev) => ({ ...prev, open: false }));
  };

  return (
    <NotificationContext.Provider
      value={{
        close: handleClose,
        notification,
        showError: showError,
        showInfo: showInfo,
        showSuccess: showSuccess,
        showWarning: showWarning,
      }}
    >
      {children}
      <SnackbarNotification {...notification} onClose={handleClose} />
    </NotificationContext.Provider>
  );
};
