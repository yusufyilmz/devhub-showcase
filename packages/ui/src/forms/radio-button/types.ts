export type RadioButtonOptions = {
  name: string;
  value: string;
  isChecked?: boolean;
  onToggle?: () => void;
  disabled?: boolean;
  label?: string;
};
