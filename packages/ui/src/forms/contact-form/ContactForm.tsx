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

export function ContactForm({ email, language }: ContactFormOptions) {
  const text = getPortfolioCopy(language);
  const id = useId();
  return (
    <form
      className={contactFormStyles.form}
      onSubmit={(event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        window.location.href = `mailto:${encodeURIComponent(email)}?subject=${encodeURIComponent(String(data.get("subject")))}&body=${encodeURIComponent(`From: ${data.get("email")}\n\n${data.get("message")}`)}`;
      }}
    >
      <div className={contactFormStyles.field}>
        <LibraryLabel htmlFor={`${id}-email`}>{text.formEmail}</LibraryLabel>
        <Input
          autoComplete="email"
          className={contactFormStyles.control}
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
          id={`${id}-message`}
          maxLength={6000}
          name="message"
          required
          rows={5}
        />
      </div>
      <div className={contactFormStyles.footer}>
        <Button className={contactFormStyles.submit} startIcon={<Mail />} type="submit">
          {text.formOpenEmail}
        </Button>
        <p className="text-xs leading-relaxed text-muted-foreground">{text.formEmailNotice}</p>
      </div>
    </form>
  );
}
