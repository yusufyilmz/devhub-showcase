import { Alert, AlertDescription, AlertTitle } from "../alert";
import { notificationStyles } from "./styles";
import type { SnackbarNotificationProps } from "./types";

export const SnackbarNotification: React.FC<SnackbarNotificationProps> = ({
  message,
  severity,
  open,
  onClose,
}) => {
  if (!open) return null;

  return (
    <div className={notificationStyles.element1}>
      <Alert variant={severity === "error" ? "destructive" : "default"}>
        <AlertTitle className={notificationStyles.element2}>{severity}</AlertTitle>
        <AlertDescription>{message}</AlertDescription>
        <button className={notificationStyles.element3} onClick={onClose} type="button">
          Close
        </button>
      </Alert>
    </div>
  );
};
