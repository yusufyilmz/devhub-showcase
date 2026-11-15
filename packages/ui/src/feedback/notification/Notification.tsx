"use client";

import { CircleCheck, CircleX, Info, TriangleAlert, X } from "lucide-react";

import { Button } from "../../buttons/button";
import { notificationStyles } from "./styles";
import type { SnackbarNotificationProps } from "./types";

const notificationIcons = {
  error: CircleX,
  info: Info,
  success: CircleCheck,
  warning: TriangleAlert,
} as const;

export function SnackbarNotification({
  message,
  severity,
  open,
  onClose,
}: SnackbarNotificationProps) {
  if (!open) return null;

  const StatusIcon = notificationIcons[severity];

  return (
    <div className={notificationStyles.root} data-severity={severity}>
      <StatusIcon aria-hidden="true" className={notificationStyles.icon} />
      <p className="min-w-0 break-words" role={severity === "error" ? "alert" : "status"}>
        {message}
      </p>
      <Button
        aria-label="Close notification"
        className={notificationStyles.close}
        onClick={onClose}
        size="icon-sm"
        type="button"
        variant="ghost"
      >
        <X aria-hidden="true" />
      </Button>
    </div>
  );
}
