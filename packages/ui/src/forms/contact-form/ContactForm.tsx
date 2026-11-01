"use client";

import { useId } from "react";

import { getPortfolioCopy, type Language } from "@shared/config";

import { Button } from "../../buttons/button";
import { Input } from "../input";
import { Textarea } from "../textarea";

export function ContactForm({ email, language }: { email: string; language?: Language }) {
  const text = getPortfolioCopy(language);
  const id = useId();
  return (
    <form
      className="section-contact-form"
      onSubmit={(event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        window.location.href = `mailto:${encodeURIComponent(email)}?subject=${encodeURIComponent(String(data.get("subject")))}&body=${encodeURIComponent(`From: ${data.get("email")}\n\n${data.get("message")}`)}`;
      }}
    >
      <label htmlFor={`${id}-email`}>{text.formEmail}</label>
      <Input id={`${id}-email`} name="email" required type="email" />
      <label htmlFor={`${id}-subject`}>{text.formSubject}</label>
      <Input id={`${id}-subject`} maxLength={200} name="subject" required />
      <label htmlFor={`${id}-message`}>{text.formMessage}</label>
      <Textarea id={`${id}-message`} maxLength={6000} name="message" required rows={5} />
      <Button type="submit">{text.formOpenEmail}</Button>
      <p>{text.formEmailNotice}</p>
    </form>
  );
}
