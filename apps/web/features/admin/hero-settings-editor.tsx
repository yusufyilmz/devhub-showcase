"use client";
import { Field, SelectField } from "@shared/components/fields";
import { HeroSurface } from "@shared/components/hero-surface";
import { getPortfolioCopy, type PortfolioProfile } from "@shared/content";
import { useState } from "react";
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
          url: "",
          position: "center",
          overlay: "strong",
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
        Use an image or a muted video behind your introduction. Video respects
        reduced motion and includes a pause control. Use media you have
        permission to publish.
      </p>
      <label>
        <input
          type="checkbox"
          checked={Boolean(hero)}
          onChange={(event) => (event.target.checked ? update({}) : clear())}
        />{" "}
        Use hero background
      </label>
      {hero && (
        <>
          <SelectField
            label="Background type"
            value={hero.kind}
            onChange={(kind) => update({ kind: kind as "image" | "video" })}
          >
            <option value="image">Image</option>
            <option value="video">Video</option>
          </SelectField>
          <Field
            label="Background media URL"
            type="url"
            value={hero.url}
            required
            onChange={(url) => update({ url })}
            hint="A direct HTTP or HTTPS image or video file URL, not a social post URL."
          />
          {hero.kind === "video" && (
            <Field
              label="Video poster URL"
              type="url"
              value={hero.poster ?? ""}
              onChange={(poster) => update({ poster })}
              hint="Optional still image shown while the video is paused or unavailable."
            />
          )}
          <SelectField
            label="Background position"
            value={hero.position}
            onChange={(position) =>
              update({ position: position as typeof hero.position })
            }
          >
            <option value="center">Center</option>
            <option value="top">Top</option>
            <option value="bottom">Bottom</option>
          </SelectField>
          <SelectField
            label="Background overlay"
            value={hero.overlay}
            onChange={(overlay) =>
              update({ overlay: overlay as typeof hero.overlay })
            }
          >
            <option value="strong">Strong contrast</option>
            <option value="soft">Soft contrast</option>
          </SelectField>
          <details onToggle={(event) => setPreview(event.currentTarget.open)}>
            <summary>Preview hero background</summary>
            {preview && (
              <HeroSurface
                media={hero}
                labels={{
                  play: text.playBackground,
                  pause: text.pauseBackground,
                }}
              >
                <div style={{ paddingBlock: "4rem" }}>
                  <h2>{profile.name}</h2>
                  <p>{profile.title}</p>
                  <p>{profile.summary}</p>
                </div>
              </HeroSurface>
            )}
          </details>
          <button className="studio-secondary" type="button" onClick={clear}>
            Remove hero background
          </button>
        </>
      )}
    </section>
  );
}
