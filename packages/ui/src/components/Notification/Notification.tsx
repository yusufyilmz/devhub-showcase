import { Alert, AlertDescription, AlertTitle } from "../Alert";

interface SnackbarNotificationProps {
  message: string;
  onClose: () => void;
  open: boolean;
  severity: "success" | "error" | "warning" | "info";
}

export const SnackbarNotification: React.FC<SnackbarNotificationProps> = ({
  message,
  severity,
  open,
  onClose,
}) => {
  if (!open) return null;

  return (
    <div className="fixed right-4 bottom-4 z-50 w-full max-w-sm">
      <Alert variant={severity === "error" ? "destructive" : "default"}>
        <AlertTitle className="capitalize">{severity}</AlertTitle>
        <AlertDescription>{message}</AlertDescription>
        <button className="col-start-2 justify-self-end text-sm" onClick={onClose} type="button">
          Close
        </button>
      </Alert>
    </div>
  );
};
