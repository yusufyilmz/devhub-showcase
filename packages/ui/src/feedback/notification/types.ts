export interface SnackbarNotificationProps {
  message: string;
  onClose: () => void;
  open: boolean;
  severity: "success" | "error" | "warning" | "info";
}
