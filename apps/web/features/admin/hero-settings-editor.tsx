"use client";
import { useState } from "react";

import { Field, SelectField } from "@shared/components/fields";
import { HeroSurface } from "@shared/components/hero-surface";
import { getPortfolioCopy, type PortfolioProfile } from "@shared/content";
export function HeroSettingsEditor({
  profile,
  onChange,
}: {
  profile: PortfolioProfile;
  onChange: (profile: PortfolioProfile) => void;
}) {
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
    <section className="editor-card">
      <h2>Hero background</h2>
      <p>
        Use an image or a muted video behind your introduction. Video respects reduced motion and
        includes a pause control. Use media you have permission to publish.
      </p>
      <label>
        <input
          checked={Boolean(hero)}
          onChange={(event) => (event.target.checked ? update({}) : clear())}
          type="checkbox"
        />{" "}
        Use hero background
      </label>
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
                <div style={{ paddingBlock: "4rem" }}>
                  <h2>{profile.name}</h2>
                  <p>{profile.title}</p>
                  <p>{profile.summary}</p>
                </div>
              </HeroSurface>
            )}
          </details>
          <button className="studio-secondary" onClick={clear} type="button">
            Remove hero background
          </button>
        </>
      )}
    </section>
  );
}
