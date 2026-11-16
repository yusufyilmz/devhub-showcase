import { cva } from "class-variance-authority";

export const customizerVariants = cva(
  "w-full mx-auto max-w-4xl rounded-xl border border-border/75 p-md shadow-xs",
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
        auto: "bg-background text-foreground",
        dark: "bg-gray-900 text-white",
        light: "bg-white text-gray-900",
      },
    },
  },
);

export const componentCustomizerStyles = {
  element1: "flex items-center gap-2 text-foreground",
  element2: "text-foreground",
  element3: "h-8 bg-background border-border text-foreground",
  element4: "text-foreground",
  element5: "h-8 bg-background border-border text-foreground",
  element6: "text-foreground",
  element7: "bg-background border-border text-foreground",
  element8: "text-foreground",
  element9: "h-8 bg-background border-border text-foreground",
  element10: "font-bold text-foreground",
  element11: "text-muted-foreground",
  element12: "min-w-0 flex-[1_1_22rem]",
  element13: "border-border/75 bg-card p-md",
  element14: "text-foreground",
  element15: "min-h-[200px] border border-dashed border-border/75 rounded-xl p-md bg-muted/40",
  element16: "border-border/75 bg-card p-md",
  element17: "text-foreground",
  element18:
    "bg-background border-border text-foreground hover:bg-accent hover:text-accent-foreground",
  element19: "bg-muted p-4 rounded-md max-w-full overflow-x-auto text-sm text-muted-foreground",
  element20: "min-w-0 flex-[1_1_16rem] border-border/75 bg-card p-md",
  element21: "text-foreground",
} as const;

export const themeCustomizerStyles = {
  element1: "space-y-2",
  element2: "text-sm font-medium text-foreground",
  element3:
    "w-full rounded-lg border border-border/75 bg-background px-sm py-xs text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
  element4: "font-bold mb-2",
  element5: "text-muted-foreground",
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
  element17: "text-muted-foreground",
  element18: "p-md shadow-md",
  element19: "text-muted-foreground",
  element20: "mb-2",
  element21: "max-w-md",
  element22: "w-fit",
  element23: "mb-2",
  element24: "w-full min-w-0 max-w-sm",
  element25: "bg-muted p-4 rounded-md max-w-full overflow-x-auto text-sm",
  element26: "w-full mt-4",
  themeCustomizer: "mx-auto grid w-full max-w-6xl min-w-0 gap-lg p-md sm:p-lg",
} as const;
