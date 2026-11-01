"use client";

import { type Dispatch, type SetStateAction, useEffect, useState } from "react";

import { AiAssistantEditor, AiProfileEditor } from "@shared/assistant/studio";
import { type PortfolioProfile, portfolioTypes } from "@shared/config";
import type { ProfileSnapshot } from "@shared/lib/profile-errors";
import { cvPath, editCvPath } from "@shared/lib/username";
import { useStudioRequest } from "@shared/runtime/studio";
import { useUserConfigStore } from "@shared/runtime/user";
import { CvImportEditor, CvSettingsEditor } from "@shared/templates/studio";
import { Button } from "@shared/ui/button";
import { Card } from "@shared/ui/cards";
import { GoogleImportEditor } from "@shared/ui/google-import";
import { Input } from "@shared/ui/input";
import { LanguageSettingsEditor, PortfolioTypePicker, ProfileFields } from "@shared/ui/portfolio";
import {
  EducationEditor,
  ExperienceEditor,
  LanguagesEditor,
  ProjectsEditor,
  SkillsEditor,
} from "@shared/ui/sections";
import {
  CustomSectionsEditor,
  SectionOrderEditor,
  SectionSettingsEditor,
  SectionTemplatesEditor,
} from "@shared/ui/sections/studio";
import { AppearanceEditor } from "@shared/ui/theme/studio";

const tabs = [
  "Profile",
  "Import CV",
  "Import Google",
  "AI profile",
  "AI assistant",
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
  const request = useStudioRequest();
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, showError] = useState("");
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
    showError("");
    setMessage("");
    try {
      const response = await request(saveUrl, {
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
      showError(
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
        managed={managed}
        onGoogleImport={() => {
          setDraft({ ...draft, templateChosen: true });
          setTab("Import Google");
        }}
        onImport={() => {
          setDraft({ ...draft, templateChosen: true });
          setTab("Import CV");
        }}
        setDraft={setDraft}
      />
    );
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
            <Button className="studio-secondary" href="/admin/billing" variant="outline">
              Plan and usage
            </Button>
            {saved.isPublic && saved.id && (
              <Button
                className="studio-secondary"
                href={saved.username ? cvPath(saved.username) : "/"}
                rel="noopener noreferrer"
                target="_blank"
                variant="outline"
              >
                View public profile ↗
              </Button>
            )}
            <Button className="studio-primary" disabled={busy || !dirty} type="submit">
              {busy ? "Saving…" : "Save changes"}
            </Button>
          </div>
        </div>
        <div className="studio-status">
          <span className={dirty ? "status-dot unsaved" : "status-dot"} />
          {dirty ? "You have unsaved changes" : "All changes saved"}
          <span>Revision {saved.revision}</span>
          <Button
            disabled={busy}
            onClick={async () => {
              if (dirty && !window.confirm("Leave without publishing your changes?")) return;
              setBusy(true);
              try {
                const response = await request("/api/admin/session", {
                  method: "DELETE",
                });
                if (!response.ok) throw new Error("Could not sign out.");
                useUserConfigStore.getState().clearUser();
                window.location.assign("/login");
              } catch (reason) {
                showError(reason instanceof Error ? reason.message : "Could not sign out.");
                setBusy(false);
              }
            }}
            type="button"
          >
            Sign out
          </Button>
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
            <Button
              aria-current={tab === item ? "page" : undefined}
              key={item}
              onClick={() => setTab(item)}
              type="button"
            >
              {item}
            </Button>
          ))}
        </nav>
        {error && (
          <div className="editor-alert" role="alert">
            <p>{error}</p>
            <Button
              disabled={busy}
              onClick={() => {
                if (window.confirm("Reload and discard unpublished changes?"))
                  window.location.reload();
              }}
              type="button"
            >
              Reload latest version
            </Button>
          </div>
        )}
        {message && (
          <p className="editor-success" role="status">
            {message}
          </p>
        )}
        <fieldset className="editor-body" disabled={busy}>
          <legend className="sr-only">{tab} editor</legend>
          <EditorBody
            managed={managed}
            onChange={setDraft}
            profile={draft}
            readUrl={saveUrl}
            snapshot={saved}
            tab={tab}
          />
        </fieldset>
        <footer className="editor-footer">
          <p>Save your edits to update your CV. Public sharing is optional.</p>
          <Button
            className="studio-secondary"
            disabled={!dirty || busy}
            onClick={() => {
              if (window.confirm("Discard unpublished changes?")) {
                setDraft(saved.profile);
                setUsername(saved.username ?? "");
                setIsPublic(saved.isPublic ?? false);
                showError("");
                setMessage("");
              }
            }}
            type="button"
            variant="outline"
          >
            Discard changes
          </Button>
        </footer>
      </form>
    </main>
  );
}

function EditorBody({
  tab,
  snapshot,
  managed,
  readUrl,
  profile,
  onChange,
}: {
  tab: (typeof tabs)[number];
  snapshot: ProfileSnapshot;
  managed: boolean;
  readUrl: string;
  profile: PortfolioProfile;
  onChange: (profile: PortfolioProfile) => void;
}) {
  if (tab === "AI assistant")
    return (
      <AiAssistantEditor
        managed={managed}
        onChange={onChange}
        profile={profile}
        profileId={snapshot.id}
        revision={snapshot.revision}
      />
    );
  if (tab === "Import Google")
    return <GoogleImportEditor managed={managed} onChange={onChange} profile={profile} />;
  if (tab === "AI profile") return <AiProfileEditor readUrl={readUrl} />;
  const Editor = editors[tab];
  return <Editor onChange={onChange} profile={profile} />;
}

function PortfolioOnboarding({
  draft,
  onImport,
  onGoogleImport,
  managed,
  setDraft,
}: {
  draft: PortfolioProfile;
  onImport: () => void;
  onGoogleImport: () => void;
  managed: boolean;
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
      <Button className="studio-secondary" onClick={onImport} type="button" variant="outline">
        Start from a CV
      </Button>
      {!managed && (
        <Button
          className="studio-secondary"
          onClick={onGoogleImport}
          type="button"
          variant="outline"
        >
          Start from Google profile
        </Button>
      )}
      <PortfolioTypePicker
        onChange={(portfolioType) => setDraft({ ...draft, portfolioType })}
        value={draft.portfolioType ?? "engineer"}
      />
      <Button
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
      </Button>
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
    <Card asChild layout="plain" surface="portfolio">
      <div className="editor-card studio-sharing">
        <label htmlFor="cv-username">Username</label>
        <Input
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
        <Button className="studio-secondary" href={downloadHref} variant="outline">
          Download my saved CV
        </Button>
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
    </Card>
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
    <Card asChild layout="plain" surface="portfolio">
      <section className="editor-card">
        <PortfolioTypePicker
          onChange={(portfolioType) => onChange({ ...profile, portfolioType })}
          value={profile.portfolioType ?? "engineer"}
        />
        <p>Your CV layout is chosen separately in the PDF section.</p>
      </section>
    </Card>
  );
}
const editors = {
  "AI profile": AiProfileEditor,
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
