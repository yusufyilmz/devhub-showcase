"use client";
import { getPortfolioCopy, type Language } from "@shared/content";
import { useId, useState } from "react";
export function ContactForm({
  email,
  language,
}: {
  email: string;
  language?: Language;
}) {
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
      <input id={`${id}-email`} name="email" type="email" required />
      <label htmlFor={`${id}-subject`}>{text.formSubject}</label>
      <input id={`${id}-subject`} name="subject" required maxLength={200} />
      <label htmlFor={`${id}-message`}>{text.formMessage}</label>
      <textarea
        id={`${id}-message`}
        name="message"
        required
        maxLength={6000}
        rows={5}
      />
      <button type="submit">{text.formOpenEmail}</button>
      <p>{text.formEmailNotice}</p>
    </form>
  );
}
export function LocationMap({
  latitude,
  longitude,
  title,
  language,
}: {
  latitude: number;
  longitude: number;
  title: string;
  language?: Language;
}) {
  const text = getPortfolioCopy(language);
  const [loaded, setLoaded] = useState(false);
  const valid =
    Number.isFinite(latitude) &&
    Math.abs(latitude) <= 90 &&
    Number.isFinite(longitude) &&
    Math.abs(longitude) <= 180;
  if (!valid) return null;
  const url = `https://www.openstreetmap.org/export/embed.html?bbox=${Math.max(-180, longitude - 0.01)},${Math.max(-90, latitude - 0.01)},${Math.min(180, longitude + 0.01)},${Math.min(90, latitude + 0.01)}&layer=mapnik&marker=${latitude},${longitude}`;
  return (
    <div className="section-location">
      {loaded ? (
        <iframe
          title={title}
          src={url}
          loading="lazy"
          referrerPolicy="no-referrer"
        />
      ) : (
        <button type="button" onClick={() => setLoaded(true)}>
          {text.loadMap}
        </button>
      )}
      <p>
        <a
          href={`https://www.openstreetmap.org/?mlat=${latitude}&mlon=${longitude}#map=16/${latitude}/${longitude}`}
        >
          {text.viewMap} ↗
        </a>
      </p>
    </div>
  );
}
