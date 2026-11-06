"use client";

import { useState } from "react";

import { cn } from "cn";
import { ArrowUpRight, MapPin } from "lucide-react";

import { getPortfolioCopy } from "@shared/config";

import { Button } from "../../buttons/button";
import { locationMapStyles } from "./styles";
import type { LocationMapProps } from "./types";

export function LocationMap(props: LocationMapProps) {
  const { latitude, longitude } = props;
  if (
    !Number.isFinite(latitude) ||
    Math.abs(latitude) > 90 ||
    !Number.isFinite(longitude) ||
    Math.abs(longitude) > 180
  )
    return null;

  return <MapPreview key={`${latitude}:${longitude}`} {...props} />;
}

function MapPreview({ latitude, longitude, title, language }: LocationMapProps) {
  const text = getPortfolioCopy(language);
  const [status, setStatus] = useState<"idle" | "loading" | "ready">("idle");
  const url = `https://www.openstreetmap.org/export/embed.html?bbox=${Math.max(-180, longitude - 0.01)},${Math.max(-90, latitude - 0.01)},${Math.min(180, longitude + 0.01)},${Math.min(90, latitude + 0.01)}&layer=mapnik&marker=${latitude},${longitude}`;

  return (
    <div className={locationMapStyles.container}>
      <div aria-busy={status === "loading"} className={locationMapStyles.viewport}>
        {status !== "idle" && (
          <iframe
            className={cn(
              locationMapStyles.frame,
              status === "ready" ? "opacity-100" : "opacity-0",
            )}
            loading="lazy"
            onLoad={() => setStatus("ready")}
            referrerPolicy="no-referrer"
            src={url}
            title={title}
          />
        )}
        {status !== "ready" && (
          <div className={locationMapStyles.placeholder}>
            <MapPin aria-hidden="true" className="size-7 text-primary" />
            <p className="font-medium">{title}</p>
            <Button
              aria-busy={status === "loading"}
              disabled={status === "loading"}
              onClick={() => setStatus("loading")}
              startIcon={<MapPin />}
              type="button"
            >
              {text.loadMap}
            </Button>
          </div>
        )}
      </div>
      <Button
        className="self-start"
        endIcon={<ArrowUpRight />}
        href={`https://www.openstreetmap.org/?mlat=${latitude}&mlon=${longitude}#map=16/${latitude}/${longitude}`}
        variant="link"
      >
        {text.viewMap}
      </Button>
    </div>
  );
}

export type { LocationMapProps } from "./types";
