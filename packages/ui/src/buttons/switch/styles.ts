export const switchStyles = {
  switch:
    "peer data-[state=checked]:bg-primary data-[state=unchecked]:bg-input focus-visible:border-ring focus-visible:ring-ring/50 dark:data-[state=unchecked]:bg-input/80 inline-flex h-[1.15rem] w-8 shrink-0 items-center rounded-full border border-transparent shadow-xs transition-all outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50",
  switch2:
    "bg-background dark:data-[state=unchecked]:bg-foreground dark:data-[state=checked]:bg-primary-foreground pointer-events-none block size-4 rounded-full border border-ring/70 shadow-xs motion-safe:transition-transform data-[state=checked]:translate-x-[calc(100%-2px)] data-[state=unchecked]:translate-x-0",
} as const;

export const styledSwitchStyles = {
  element1: "flex-1",
  element2: "text-muted-foreground leading-relaxed",
  getContainerClasses: "p-4 rounded-xl border transition-all",
  getContainerClasses2: "bg-card border-border hover:border-border/80 hover:bg-accent/50",
  getContainerClasses3: "hover:bg-opacity-80",
  getContainerClasses4: "p-3 rounded-lg transition-all",
  getContainerClasses5: "hover:bg-accent/50",
  styledSwitch: "flex items-center",
  styledSwitch2: "text-muted-foreground",
  styledSwitch3: "font-semibold text-sm",
  styledSwitch4: "text-foreground",
} as const;

export const colorSchemeClasses = {
  error: "data-[state=checked]:bg-destructive",
  primary: "data-[state=checked]:bg-primary",
  secondary: "data-[state=checked]:bg-secondary",
  success: "data-[state=checked]:bg-success",
  warning: "data-[state=checked]:bg-warning",
};

export const colorSchemeBgClasses = {
  error: "bg-destructive/5 border-destructive/20",
  primary: "bg-primary/5 border-primary/20",
  secondary: "bg-secondary/5 border-secondary/20",
  success: "bg-success/5 border-success/20",
  warning: "bg-warning/5 border-warning/20",
};

export const colorSchemeTextClasses = {
  error: "text-destructive",
  primary: "text-primary",
  secondary: "text-secondary",
  success: "text-success",
  warning: "text-warning",
};
