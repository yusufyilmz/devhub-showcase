"use client";

import { useState } from "react";

import { getPortfolioCopy, type PortfolioProfile } from "@shared/config";

import { Button } from "../../buttons";
import { Card } from "../../cards";
import { Field, SelectField } from "../../forms";
import { Input as LibraryInput } from "../../forms/input/Input";
import { Label as LibraryLabel } from "../../forms/label/Label";
import { HeroSurface } from "../../layout/hero";
import { heroSettingsEditorInlineStyle1, heroSettingsEditorStyles } from "./styles";
import type { HeroSettingsEditorOptions } from "./types";

export function HeroSettingsEditor({ profile, onChange }: HeroSettingsEditorOptions) {
  const [preview, setPreview] = useState(false);
  const text = getPortfolioCopy(profile.portfolioLanguage);
  const hero = profile.hero;
  const update = (patch: Partial<NonNullable<PortfolioProfile["hero"]>>) =>
    onChange({
      ...profile,
      hero: {
        ...(hero ?? {
          kind: "image",
          overlay: "strong",
          position: "center",
          url: "",
        }),
        ...patch,
      },
    });
  const clear = () => {
    const { hero: _hero, ...rest } = profile;
    onChange(rest);
  };
  return (
    <Card asChild layout="plain" surface="portfolio">
      <section className={heroSettingsEditorStyles.element1}>
        <h2>Hero background</h2>
        <p>
          Use an image or a muted video behind your introduction. Video respects reduced motion and
          includes a pause control. Use media you have permission to publish.
        </p>
        <LibraryLabel unstyled>
          <LibraryInput
            checked={Boolean(hero)}
            onChange={(event) => (event.target.checked ? update({}) : clear())}
            type="checkbox"
            unstyled
          />{" "}
          Use hero background
        </LibraryLabel>
        {hero && (
          <>
            <SelectField
              label="Background type"
              onChange={(kind) => update({ kind: kind as "image" | "video" })}
              value={hero.kind}
            >
              <option value="image">Image</option>
              <option value="video">Video</option>
            </SelectField>
            <Field
              hint="A direct HTTP or HTTPS image or video file URL, not a social post URL."
              label="Background media URL"
              onChange={(url) => update({ url })}
              required
              type="url"
              value={hero.url}
            />
            {hero.kind === "video" && (
              <Field
                hint="Optional still image shown while the video is paused or unavailable."
                label="Video poster URL"
                onChange={(poster) => update({ poster })}
                type="url"
                value={hero.poster ?? ""}
              />
            )}
            <SelectField
              label="Background position"
              onChange={(position) => update({ position: position as typeof hero.position })}
              value={hero.position}
            >
              <option value="center">Center</option>
              <option value="top">Top</option>
              <option value="bottom">Bottom</option>
            </SelectField>
            <SelectField
              label="Background overlay"
              onChange={(overlay) => update({ overlay: overlay as typeof hero.overlay })}
              value={hero.overlay}
            >
              <option value="strong">Strong contrast</option>
              <option value="soft">Soft contrast</option>
            </SelectField>
            <details onToggle={(event) => setPreview(event.currentTarget.open)}>
              <summary>Preview hero background</summary>
              {preview && (
                <HeroSurface
                  labels={{
                    pause: text.pauseBackground,
                    play: text.playBackground,
                  }}
                  media={hero}
                >
                  <div style={heroSettingsEditorInlineStyle1}>
                    <h2>{profile.name}</h2>
                    <p>{profile.title}</p>
                    <p>{profile.summary}</p>
                  </div>
                </HeroSurface>
              )}
            </details>
            <Button
              className={heroSettingsEditorStyles.element2}
              onClick={clear}
              type="button"
              variant="outline"
            >
              Remove hero background
            </Button>
          </>
        )}
      </section>
    </Card>
  );
}
