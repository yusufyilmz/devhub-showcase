const fieldBorder = "border-border/75 user-invalid:border-destructive";

export const contactFormStyles = {
  control: `h-11 ${fieldBorder}`,
  field: "grid min-w-0 gap-xs",
  footer: "grid justify-items-start gap-xs border-t border-border/60 pt-sm",
  form: "grid w-full min-w-0 max-w-2xl gap-md rounded-xl border border-border/75 bg-card p-md text-card-foreground sm:p-lg",
  message: `min-h-28 resize-y ${fieldBorder}`,
  submit: "h-11 gap-xs px-md max-sm:w-full",
} as const;
