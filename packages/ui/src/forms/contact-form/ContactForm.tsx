"use client";

import { useId } from "react";

import { Mail } from "lucide-react";

import { getPortfolioCopy } from "@shared/config";

import { Button } from "../../buttons/button";
import { Input } from "../input";
import { Label as LibraryLabel } from "../label/Label";
import { Textarea } from "../textarea";
import { contactFormStyles } from "./styles";
import type { ContactFormOptions } from "./types";

export function ContactForm({ email, language, preview = false }: ContactFormOptions) {
  const text = getPortfolioCopy(language);
  const id = useId();
  const fields = (
    <>
      <div className={contactFormStyles.field}>
        <LibraryLabel htmlFor={`${id}-email`}>{text.formEmail}</LibraryLabel>
        <Input
          autoComplete="email"
          className={contactFormStyles.control}
          disabled={preview}
          id={`${id}-email`}
          name="email"
          required
          type="email"
        />
      </div>
      <div className={contactFormStyles.field}>
        <LibraryLabel htmlFor={`${id}-subject`}>{text.formSubject}</LibraryLabel>
        <Input
          className={contactFormStyles.control}
          disabled={preview}
          id={`${id}-subject`}
          maxLength={200}
          name="subject"
          required
        />
      </div>
      <div className={contactFormStyles.field}>
        <LibraryLabel htmlFor={`${id}-message`}>{text.formMessage}</LibraryLabel>
        <Textarea
          className={contactFormStyles.message}
          disabled={preview}
          id={`${id}-message`}
          maxLength={6000}
          name="message"
          required
          rows={5}
        />
      </div>
      <div className={contactFormStyles.footer}>
        <Button
          className={contactFormStyles.submit}
          disabled={preview}
          startIcon={<Mail />}
          type={preview ? "button" : "submit"}
        >
          {text.formOpenEmail}
        </Button>
        <p className="text-xs leading-relaxed text-muted-foreground">{text.formEmailNotice}</p>
      </div>
    </>
  );
  if (preview) return <div className={contactFormStyles.form}>{fields}</div>;
  return (
    <form
      className={contactFormStyles.form}
      onSubmit={(event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        window.location.href = `mailto:${encodeURIComponent(email)}?subject=${encodeURIComponent(String(data.get("subject")))}&body=${encodeURIComponent(`From: ${data.get("email")}\n\n${data.get("message")}`)}`;
      }}
    >
      {fields}
    </form>
  );
}
