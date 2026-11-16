import { Mail } from "lucide-react";

import { ContactForm } from "../../forms";
import { SectionPresentation } from "../section-presentation";
import type { SectionProps } from "../types";

export function ContactFormSection(props: SectionProps) {
  const { section, language, preview } = props;
  if (section.options?.layout !== "contact-split") {
    return <SectionPresentation {...props} type="contact-form" />;
  }
  if (!section.visible) return null;

  const headingId = `${section.id}-heading`;
  const { description, email } = section.options;
  return (
    <section
      aria-labelledby={headingId}
      className="@container scroll-mt-24 min-w-0 py-xl"
      data-section-layout="contact-split"
      data-section-type="contact-form"
      id={section.id}
    >
      <div className="grid min-w-0 gap-md @3xl:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
        <header className="grid min-w-0 content-start gap-md rounded-xl border border-border/70 bg-linear-to-br from-primary/10 via-card to-card p-lg wrap-anywhere @lg:p-xl">
          <h2 className="text-balance text-3xl font-semibold tracking-tight" id={headingId}>
            {section.title}
          </h2>
          {description && (
            <p className="max-w-prose leading-relaxed text-muted-foreground">{description}</p>
          )}
          {email && (
            <span className="inline-flex min-w-0 items-start gap-s text-sm font-medium text-foreground">
              <Mail aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
              <span className="wrap-anywhere">{email}</span>
            </span>
          )}
        </header>
        {email && <ContactForm email={email} language={language} preview={preview} />}
      </div>
    </section>
  );
}
