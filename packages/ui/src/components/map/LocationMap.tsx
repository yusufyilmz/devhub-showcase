"use client";

import { useState } from "react";

import type { Language } from "@shared/config";
import { getPortfolioCopy } from "@shared/config";

import { Button } from "../button";

export interface LocationMapProps {
  language?: Language;
  latitude: number;
  longitude: number;
  title: string;
}

export function LocationMap({ latitude, longitude, title, language }: LocationMapProps) {
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
        <iframe loading="lazy" referrerPolicy="no-referrer" src={url} title={title} />
      ) : (
        <Button onClick={() => setLoaded(true)} type="button">
          {text.loadMap}
        </Button>
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
