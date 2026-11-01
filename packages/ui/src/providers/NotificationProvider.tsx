"use client";

import type React from "react";
import { useCallback, useState } from "react";

import { NotificationContext, type NotificationType } from "@shared/runtime/notifications";

import { Alert, AlertDescription } from "../feedback/alert";

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
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
      {notification.open && (
        <Alert
          className="fixed bottom-4 left-1/2 max-w-xs -translate-x-1/2 shadow-lg"
          variant={notification.severity === "error" ? "destructive" : "default"}
        >
          <AlertDescription>{notification.message}</AlertDescription>
          <button className="col-start-2 text-sm" onClick={handleClose} type="button">
            Close
          </button>
        </Alert>
      )}
    </NotificationContext.Provider>
  );
};
