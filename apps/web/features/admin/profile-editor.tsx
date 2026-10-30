"use client";
import { type Dispatch, type SetStateAction, useEffect, useState } from "react";

import { type PortfolioProfile, portfolioTypes } from "@shared/content";
import type { ProfileSnapshot } from "@shared/lib/profile-errors";
import { cvPath, editCvPath } from "@shared/lib/username";

import { AppearanceEditor } from "./appearance-editor";
import {
  EducationEditor,
  ExperienceEditor,
  LanguagesEditor,
  ProjectsEditor,
} from "./career-editors";
import { CustomSectionsEditor } from "./custom-sections-editor";
import { CvImportEditor } from "./cv-import-editor";
import { CvSettingsEditor } from "./cv-settings-editor";
import { LanguageSettingsEditor } from "./language-settings-editor";
import { PortfolioTypePicker } from "./portfolio-type-picker";
import { ProfileFields } from "./profile-fields";
import { SectionOrderEditor } from "./section-order-editor";
import { SectionSettingsEditor } from "./section-settings-editor";
import { SectionTemplatesEditor } from "./section-templates-editor";
import { SkillsEditor } from "./skills-editor";

const tabs = [
  "Profile",
  "Import CV",
  "Experience",
  "Projects",
  "Education",
  "Skills",
  "Languages",
  "Language settings",
  "Layout",
  "Section order",
  "Section display",
  "Custom sections",
  "Templates",
  "Appearance",
  "PDF",
] as const;
function clean(profile: PortfolioProfile): PortfolioProfile {
  const lines = (values: string[]) => values.filter((value) => value.trim());
  return {
    ...profile,
    about: lines(profile.about),
    experiences: profile.experiences.map((item) => ({
      ...item,
      achievements: lines(item.achievements),
    })),
    projects: profile.projects.map((item) => ({
      ...item,
      skills: lines(item.skills),
    })),
    skills: Object.fromEntries(
      Object.entries(profile.skills).map(([key, values]) => [key, lines(values)]),
    ),
  };
}
export function ProfileEditor({
  initial,
  saveUrl = "/api/admin/profile",
  downloadHref = "/api/admin/cv",
  managed = false,
  onSaved,
}: {
  initial: ProfileSnapshot;
  saveUrl?: string;
  downloadHref?: string;
  managed?: boolean;
  onSaved?: (snapshot: ProfileSnapshot) => void;
}) {
  const [saved, setSaved] = useState(initial);
  const [username, setUsername] = useState(initial.username ?? "");
  const [draft, setDraft] = useState(initial.profile);
  const [isPublic, setIsPublic] = useState(initial.isPublic ?? false);
  const [tab, setTab] = useState<(typeof tabs)[number]>("Profile");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const dirty =
    JSON.stringify(draft) !== JSON.stringify(saved.profile) ||
    isPublic !== (saved.isPublic ?? false) ||
    username !== (saved.username ?? "");
  useEffect(() => {
    const warn = (event: BeforeUnloadEvent) => {
      if (dirty) {
        event.preventDefault();
        event.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);
  async function publish() {
    setBusy(true);
    setError("");
    setMessage("");
    try {
      const response = await fetch(saveUrl, {
        body: JSON.stringify({
          isPublic,
          profile: clean(draft),
          revision: saved.revision,
          ...(username ? { username } : {}),
        }),
        headers: { "Content-Type": "application/json" },
        method: "PUT",
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error);
      if (!managed && result.username && result.username !== saved.username)
        window.history.replaceState(null, "", editCvPath(result.username));
      setUsername(result.username ?? username);
      setSaved(result);
      setDraft(result.profile);
      setIsPublic(result.isPublic ?? isPublic);
      setMessage("Saved. Your CV now uses these details.");
      onSaved?.(result);
    } catch (reason) {
      setError(
        reason instanceof Error
          ? reason.message
          : "Could not publish. Your changes are still here.",
      );
    } finally {
      setBusy(false);
    }
  }
  if (draft.templateChosen === false)
    return (
      <PortfolioOnboarding
        draft={draft}
        onImport={() => {
          setDraft({ ...draft, templateChosen: true });
          setTab("Import CV");
        }}
        setDraft={setDraft}
      />
    );
  const CurrentEditor = editors[tab];
  return (
    <main className="studio" id="admin-content">
      <form
        onSubmit={async (event) => {
          event.preventDefault();
          await publish();
        }}
      >
        <div className="studio-heading">
          <div>
            <p className="eyebrow">A SPACE FOR YOUR STORY</p>
            <h1>
              Make it <span>yours.</span>
            </h1>
            <p>Keep your portfolio as current as your work.</p>
          </div>
          <div className="studio-header-actions">
            {saved.isPublic && saved.id && (
              <a
                className="studio-secondary"
                href={saved.username ? cvPath(saved.username) : "/"}
                rel="noopener noreferrer"
                target="_blank"
              >
                View public profile ↗
              </a>
            )}
            <button className="studio-primary" disabled={busy || !dirty} type="submit">
              {busy ? "Saving…" : "Save changes"}
            </button>
          </div>
        </div>
        <div className="studio-status">
          <span className={dirty ? "status-dot unsaved" : "status-dot"} />
          {dirty ? "You have unsaved changes" : "All changes saved"}
          <span>Revision {saved.revision}</span>
          <button
            disabled={busy}
            onClick={async () => {
              if (dirty && !window.confirm("Leave without publishing your changes?")) return;
              setBusy(true);
              try {
                const response = await fetch("/api/admin/session", {
                  method: "DELETE",
                });
                if (!response.ok) throw new Error("Could not sign out.");
                window.location.assign("/admin/login");
              } catch (reason) {
                setError(reason instanceof Error ? reason.message : "Could not sign out.");
                setBusy(false);
              }
            }}
            type="button"
          >
            Sign out
          </button>
        </div>
        <SharingSettings
          busy={busy}
          downloadHref={downloadHref}
          isPublic={isPublic}
          managed={managed}
          saved={saved}
          setIsPublic={setIsPublic}
          setUsername={setUsername}
          username={username}
        />
        <nav aria-label="Editor sections" className="editor-tabs">
          {tabs.map((item) => (
            <button
              aria-current={tab === item ? "page" : undefined}
              key={item}
              onClick={() => setTab(item)}
              type="button"
            >
              {item}
            </button>
          ))}
        </nav>
        {error && (
          <div className="editor-alert" role="alert">
            <p>{error}</p>
            <button
              disabled={busy}
              onClick={() => {
                if (window.confirm("Reload and discard unpublished changes?"))
                  window.location.reload();
              }}
              type="button"
            >
              Reload latest version
            </button>
          </div>
        )}
        {message && (
          <p className="editor-success" role="status">
            {message}
          </p>
        )}
        <fieldset className="editor-body" disabled={busy}>
          <legend className="sr-only">{tab} editor</legend>
          <CurrentEditor onChange={setDraft} profile={draft} />
        </fieldset>
        <footer className="editor-footer">
          <p>Save your edits to update your CV. Public sharing is optional.</p>
          <button
            className="studio-secondary"
            disabled={!dirty || busy}
            onClick={() => {
              if (window.confirm("Discard unpublished changes?")) {
                setDraft(saved.profile);
                setUsername(saved.username ?? "");
                setIsPublic(saved.isPublic ?? false);
                setError("");
                setMessage("");
              }
            }}
            type="button"
          >
            Discard changes
          </button>
        </footer>
      </form>
    </main>
  );
}

function PortfolioOnboarding({
  draft,
  onImport,
  setDraft,
}: {
  draft: PortfolioProfile;
  onImport: () => void;
  setDraft: Dispatch<SetStateAction<PortfolioProfile>>;
}) {
  return (
    <main className="studio type-onboarding" id="admin-content">
      <p className="eyebrow">START WITH YOUR STYLE</p>
      <h1>
        A home for <span>your work.</span>
      </h1>
      <p>
        Pick a starting layout, then add your details. Your portfolio stays private until you
        publish it.
      </p>
      <button className="studio-secondary" onClick={onImport} type="button">
        Start from a CV
      </button>
      <PortfolioTypePicker
        onChange={(portfolioType) => setDraft({ ...draft, portfolioType })}
        value={draft.portfolioType ?? "engineer"}
      />
      <button
        className="studio-primary"
        onClick={() =>
          setDraft({
            ...draft,
            cvLayout:
              portfolioTypes.find((type) => type.id === (draft.portfolioType ?? "engineer"))
                ?.cvLayout ?? "classic",
            templateChosen: true,
          })
        }
        type="button"
      >
        Use this layout
      </button>
      <p>
        Save changes in the editor to keep your selection. Your information is never replaced by
        sample content.
      </p>
    </main>
  );
}
function SharingSettings({
  saved,
  username,
  setUsername,
  isPublic,
  setIsPublic,
  busy,
  downloadHref,
  managed,
}: {
  saved: ProfileSnapshot;
  username: string;
  setUsername: (value: string) => void;
  isPublic: boolean;
  setIsPublic: (value: boolean) => void;
  busy: boolean;
  downloadHref: string;
  managed: boolean;
}) {
  return (
    <div className="editor-card studio-sharing">
      <label htmlFor="cv-username">Username</label>
      <input
        disabled={busy}
        id="cv-username"
        maxLength={50}
        minLength={3}
        onChange={(event) => setUsername(event.target.value.toLowerCase())}
        pattern="[a-z0-9]+(-[a-z0-9]+)*"
        required
        value={username}
      />
      <p>
        Public portfolio: /{username || "username"}.{" "}
        {managed
          ? "This temporary portfolio is managed from your admin dashboard."
          : `Your editor: /${username || "username"}/edit.`}{" "}
        Changing your username changes the public link.
      </p>
      <label>
        <input
          checked={isPublic}
          disabled={busy}
          onChange={(event) => setIsPublic(event.target.checked)}
          type="checkbox"
        />{" "}
        Publish my profile and CV at a public link
      </label>
      <p>
        {isPublic
          ? "Anyone with the link can read your published contact and career details."
          : "Your CV is private. Only you can read and download it."}
      </p>
      <a className="studio-secondary" href={downloadHref}>
        Download my saved CV
      </a>
      {saved.isPublic && saved.id && (
        <a
          href={saved.username ? cvPath(saved.username) : `/p/${saved.id}`}
          rel="noopener noreferrer"
          target="_blank"
        >
          Open share link ↗
        </a>
      )}
    </div>
  );
}
function LayoutEditor({
  profile,
  onChange,
}: {
  profile: PortfolioProfile;
  onChange: (profile: PortfolioProfile) => void;
}) {
  return (
    <section className="editor-card">
      <PortfolioTypePicker
        onChange={(portfolioType) => onChange({ ...profile, portfolioType })}
        value={profile.portfolioType ?? "engineer"}
      />
      <p>Your CV layout is chosen separately in the PDF section.</p>
    </section>
  );
}
const editors = {
  Appearance: AppearanceEditor,
  "Custom sections": CustomSectionsEditor,
  Education: EducationEditor,
  Experience: ExperienceEditor,
  "Import CV": CvImportEditor,
  "Language settings": LanguageSettingsEditor,
  Languages: LanguagesEditor,
  Layout: LayoutEditor,
  PDF: CvSettingsEditor,
  Profile: ProfileFields,
  Projects: ProjectsEditor,
  "Section display": SectionSettingsEditor,
  "Section order": SectionOrderEditor,
  Skills: SkillsEditor,
  Templates: SectionTemplatesEditor,
};
