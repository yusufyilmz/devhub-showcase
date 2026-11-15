import { cva } from "class-variance-authority";

export const customizerVariants = cva(
  "w-full max-w-4xl mx-auto p-sm border border-border rounded-xl shadow-xs",
  {
    defaultVariants: {
      size: "md",
      theme: "auto",
    },
    variants: {
      size: {
        full: "max-w-none",
        lg: "max-w-6xl",
        md: "max-w-4xl",
        sm: "max-w-2xl",
      },
      theme: {
        auto: "bg-[var(--background)] text-[var(--foreground)]",
        dark: "bg-gray-900 text-white",
        light: "bg-white text-gray-900",
      },
    },
  },
);

export const componentCustomizerStyles = {
  element1: "flex items-center gap-2 text-foreground",
  element2: "text-[var(--foreground)]",
  element3: "h-8 bg-[var(--background)] border-[var(--border)] text-[var(--foreground)]",
  element4: "text-[var(--foreground)]",
  element5: "h-8 bg-[var(--background)] border-[var(--border)] text-[var(--foreground)]",
  element6: "text-[var(--foreground)]",
  element7: "bg-[var(--background)] border-[var(--border)] text-[var(--foreground)]",
  element8: "text-[var(--foreground)]",
  element9: "h-8 bg-[var(--background)] border-[var(--border)] text-[var(--foreground)]",
  element10: "font-bold text-[var(--foreground)]",
  element11: "text-[var(--muted-foreground)]",
  element12: "min-w-0 flex-[1_1_22rem]",
  element13: "p-md bg-card border-border",
  element14: "text-[var(--foreground)]",
  element15: "min-h-[200px] border border-dashed border-border rounded-xl p-md bg-muted/40",
  element16: "p-md bg-card border-border",
  element17: "text-[var(--foreground)]",
  element18:
    "bg-[var(--background)] border-[var(--border)] text-[var(--foreground)] hover:bg-[var(--accent)] hover:text-[var(--accent-foreground)]",
  element19:
    "bg-[var(--muted)] p-4 rounded-md max-w-full overflow-x-auto text-sm text-[var(--muted-foreground)]",
  element20: "min-w-0 flex-[1_1_16rem] p-md bg-card border-border",
  element21: "text-[var(--foreground)]",
} as const;

export const themeCustomizerStyles = {
  element1: "space-y-2",
  element2: "text-sm font-medium text-foreground",
  element3:
    "w-full px-3 py-2 border border-[var(--border)] rounded-md bg-[var(--background)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]",
  element4: "font-bold mb-2",
  element5: "text-[var(--muted-foreground)]",
  element6: "min-w-0 flex-[1_1_22rem]",
  element7: "flex-1",
  element8: "flex-1",
  element9: "flex-1",
  element10: "flex-1",
  element11: "mt-4",
  element12: "flex-1",
  element13: "flex-1",
  element14: "mb-2",
  element15: "mb-2",
  element16: "p-4",
  element17: "text-[var(--muted-foreground)]",
  element18: "p-md shadow-md",
  element19: "text-[var(--muted-foreground)]",
  element20: "mb-2",
  element21: "max-w-md",
  element22: "w-fit",
  element23: "mb-2",
  element24: "w-full min-w-0 max-w-sm",
  element25: "bg-[var(--muted)] p-4 rounded-md max-w-full overflow-x-auto text-sm",
  element26: "w-full mt-4",
  themeCustomizer: "w-full max-w-6xl mx-auto p-lg space-y-8",
} as const;
