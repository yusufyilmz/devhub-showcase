export const contactFormStyles = {
  control: "h-[2.5rem] border-border bg-background px-[0.75rem]",
  field: "grid min-w-0 gap-[0.375rem]",
  footer: "grid justify-items-start gap-[0.5rem]",
  form: "grid w-full max-w-[42rem] gap-[clamp(0.875rem,var(--spacing-s),1.25rem)] rounded-xl border bg-card p-[clamp(1rem,var(--spacing-sm),1.5rem)] text-card-foreground",
  message: "min-h-[6rem] resize-y border-border bg-background px-[0.75rem] py-[0.625rem]",
  submit: "h-[2.5rem] gap-[0.5rem] px-[0.875rem]",
} as const;
