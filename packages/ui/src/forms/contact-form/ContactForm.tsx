"use client";

import { useId } from "react";

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
      className={contactFormStyles.element1}
      onSubmit={(event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        window.location.href = `mailto:${encodeURIComponent(email)}?subject=${encodeURIComponent(String(data.get("subject")))}&body=${encodeURIComponent(`From: ${data.get("email")}\n\n${data.get("message")}`)}`;
      }}
    >
      <LibraryLabel htmlFor={`${id}-email`} unstyled>
        {text.formEmail}
      </LibraryLabel>
      <Input id={`${id}-email`} name="email" required type="email" />
      <LibraryLabel htmlFor={`${id}-subject`} unstyled>
        {text.formSubject}
      </LibraryLabel>
      <Input id={`${id}-subject`} maxLength={200} name="subject" required />
      <LibraryLabel htmlFor={`${id}-message`} unstyled>
        {text.formMessage}
      </LibraryLabel>
      <Textarea id={`${id}-message`} maxLength={6000} name="message" required rows={5} />
      <Button type="submit">{text.formOpenEmail}</Button>
      <p>{text.formEmailNotice}</p>
    </form>
  );
}
