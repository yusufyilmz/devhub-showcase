"use client";

import type React from "react";
import { createContext, useCallback, useContext, useState } from "react";

import { Alert } from "@mui/material";

import { Typography } from "../components/ui/Typography/Typography";

export interface NotificationContextProps {
  setError: (message: string) => void;
  setInfo: (message: string) => void;
  setSuccess: (message: string) => void;
}

type AlertTypes = "success" | "error" | "warning" | "info";

export const NotificationContext = createContext<NotificationContextProps | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notification, setNotification] = useState({
    message: "",
    open: false,
    severity: "success" as AlertTypes,
  });

  const setError = useCallback((message: string) => {
    setNotification({ message, open: true, severity: "error" });
  }, []);

  const setSuccess = useCallback((message: string) => {
    setNotification({ message, open: true, severity: "success" });
  }, []);

  const setInfo = useCallback((message: string) => {
    setNotification({ message, open: true, severity: "info" });
  }, []);

  const handleClose = () => {
    setNotification((prev) => ({ ...prev, open: false }));
  };

  return (
    <NotificationContext.Provider value={{ setError, setInfo, setSuccess }}>
      {children}
      {notification.open && (
        <Alert
          className="fixed bottom-4 left-1/2 transform -translate-x-1/2 max-w-xs shadow-lg"
          color={notification.severity}
          onClose={handleClose}
        >
          <Typography className="text-white" variant="body2">
            {notification.message}
          </Typography>
        </Alert>
      )}
    </NotificationContext.Provider>
  );
};

export const useNotification = (): NotificationContextProps => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotification must be used within a NotificationProvider");
  }
  return context;
};
