import { cn } from "cn";

interface DividerProps {
  className?: string;
}

export const Divider = ({ className }: DividerProps) => {
  return <hr className={cn("my-[var(--spacing-lg)] border-t border-[var(--border)]", className)} />;
};
