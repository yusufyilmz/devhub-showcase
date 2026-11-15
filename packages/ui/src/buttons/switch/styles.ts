export const switchStyles = {
  switch:
    "peer inline-flex h-5 w-9 shrink-0 items-center rounded-full border border-border/80 bg-foreground/20 enabled:hover:border-border outline-none motion-safe:transition-colors focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-offset-2 focus-visible:outline-ring data-[state=checked]:border-transparent data-[state=checked]:bg-primary disabled:cursor-not-allowed disabled:opacity-50",
  switch2:
    "pointer-events-none mx-px block size-4 rounded-full border border-border bg-background shadow-xs motion-safe:transition-transform data-[state=checked]:translate-x-4 rtl:data-[state=checked]:-translate-x-4",
} as const;

export const styledSwitchStyles = {
  element1: "min-w-0 flex-1",
  element2: "leading-relaxed wrap-anywhere text-muted-foreground",
  getContainerClasses: "rounded-xl border p-md motion-safe:transition-colors",
  getContainerClasses2: "border-border/75 bg-card hover:border-border hover:bg-accent/50",
  getContainerClasses4: "rounded-lg p-sm motion-safe:transition-colors",
  getContainerClasses5: "hover:bg-accent/50",
  styledSwitch: "flex items-center",
  styledSwitch2: "text-muted-foreground",
  styledSwitch3: "text-sm font-semibold wrap-anywhere",
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
  secondary: "text-foreground",
  success: "text-success",
  warning: "text-warning",
};
