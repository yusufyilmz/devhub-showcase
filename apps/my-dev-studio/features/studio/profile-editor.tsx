"use client";

import "@shared/ui/components.css";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

import { AiAssistantEditor, AiProfileEditor } from "@shared/assistant/studio";
import { type PortfolioProfile, type PortfolioType, portfolioTypes } from "@shared/config";
import { urls } from "@shared/config/urls";
import { cvPath, editCvPath } from "@shared/lib/profiles";
import { useStudioRequest } from "@shared/runtime/studio";
import { useUserConfigStore } from "@shared/runtime/user";
import type { ProfileSnapshot } from "@shared/services/profile";
import { CvImportEditor, CvSettingsEditor } from "@shared/templates/studio";
import { Button } from "@shared/ui/button";
import { Card } from "@shared/ui/cards";
import { GoogleImportEditor } from "@shared/ui/google-import";
import { Input, Input as LibraryInput } from "@shared/ui/input";
import { Label as LibraryLabel } from "@shared/ui/label";
import {
  clearDraftRecovery,
  DraftRecovery,
  EditorGuidance,
  GuidedOnboarding,
  LanguageSettingsEditor,
  PortfolioTypePicker,
  ProfileFields,
  recoveryPrefix,
  SetupNavigation,
  type SetupStep,
  useDraftRecovery,
  usePortfolioHistory,
} from "@shared/ui/portfolio";
import { ResponsivePortfolioPreview } from "@shared/ui/portfolio-preview";
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

const PreviewContent = dynamic(() =>
  import("./preview-content").then((module) => module.PreviewContent),
);

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
  saveUrl = urls.next.studio.profile(),
  downloadHref = urls.next.studio.cv(),
  managed = false,
  onSaved,
  initialTab = "Profile",
}: {
  initial: ProfileSnapshot;
  saveUrl?: string;
  downloadHref?: string;
  managed?: boolean;
  onSaved?: (snapshot: ProfileSnapshot) => void;
  initialTab?: (typeof tabs)[number];
}) {
  const userId = useUserConfigStore((state) => state.user?.id);
  const [profession, setProfession] = useState<PortfolioType>(defaultProfession(initial.profile));
  const [step, setStep] = useState<SetupStep>(initialSetup(initial.profile));
  const [saved, setSaved] = useState(initial);
  const [username, setUsername] = useState(initial.username ?? "");
  const [busy, setBusy] = useState(false);
  const { draft, setDraft, resetDraft, undo, redo, canUndo, canRedo } = usePortfolioHistory(
    initial.profile,
    busy,
  );
  const [isPublic, setIsPublic] = useState(initial.isPublic ?? false);
  const [tab, setTab] = useState<(typeof tabs)[number]>(initialTab);
  const request = useStudioRequest();
  const [message, setMessage] = useState("");
  const [error, showError] = useState("");
  const dirty =
    JSON.stringify(draft) !== JSON.stringify(saved.profile) ||
    isPublic !== (saved.isPublic ?? false) ||
    username !== (saved.username ?? "");
  const recovery = useDraftRecovery({
    dirty,
    onRestore: (value) => {
      resetDraft(value.profile);
      setUsername(value.username);
      setIsPublic(value.isPublic);
      if (tabs.includes(value.tab as typeof tab)) setTab(value.tab as typeof tab);
      setStep(value.step);
      setProfession(defaultProfession(value.profile, value.profession));
    },
    revision: saved.revision,
    storageKey: recoveryKey(userId, initial.id, saveUrl),
    value: { isPublic, profession, profile: draft, step, tab, username },
  });
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
    if (recovery.stale) return;
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
      const result = await readSaveResponse(response, recovery.conflict);
      if (!managed && result.username && result.username !== saved.username)
        window.history.replaceState(null, "", editCvPath(result.username));
      setUsername(result.username ?? username);
      recovery.saved(result.revision);
      setSaved(result);
      resetDraft(result.profile);
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
  function beginDetails(nextTab: typeof tab = "Profile") {
    resetDraft({
      ...draft,
      cvLayout: onboardingCvLayout(draft),
      templateChosen: true,
    });
    setTab(nextTab);
    setStep("details");
  }
  if (step === "template")
    return (
      <GuidedOnboarding
        managed={managed}
        onChange={resetDraft}
        onContinue={() => beginDetails()}
        onGoogleImport={() => beginDetails("Import Google")}
        onImport={() => beginDetails("Import CV")}
        onProfessionChange={(value) => {
          setProfession(value);
          resetDraft({ ...draft, portfolioType: value });
        }}
        profession={profession}
        profile={draft}
      >
        <DraftRecovery disabled={busy} recovery={recovery} />
      </GuidedOnboarding>
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
            <Button
              className="studio-primary"
              disabled={busy || !dirty || recovery.stale}
              type="submit"
            >
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
                const response = await request(urls.next.auth.session(), {
                  method: "DELETE",
                });
                if (!response.ok) throw new Error("Could not sign out.");
                try {
                  recovery.stop();
                  clearDraftRecovery();
                } catch {
                  /* Browser storage may be disabled. */
                }
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
        <DraftRecovery disabled={busy} recovery={recovery} />
        <SetupNavigation
          disabled={busy}
          onImport={() => setTab("Import CV")}
          onManual={() => setTab("Profile")}
          onStep={(next) => {
            setStep(next);
            if (next === "review") setTab("Profile");
          }}
          step={step}
        />
        <EditorGuidance
          canRedo={canRedo}
          canUndo={canUndo}
          disabled={busy}
          onNavigate={(next, label) => {
            setTab(next);
            requestAnimationFrame(() => {
              const target = Array.from(
                document.querySelectorAll<HTMLLabelElement>("#admin-content label"),
              ).find((node) => node.querySelector("span")?.textContent === label);
              const input = target?.querySelector<HTMLElement>("input, textarea");
              const heading = document.querySelector<HTMLElement>(".editor-section-heading h2");
              (input ?? heading)?.scrollIntoView({ behavior: "auto", block: "center" });
              input?.focus({ preventScroll: true });
            });
          }}
          profile={draft}
          redo={redo}
          undo={undo}
        />
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
        <DraftPreview profile={draft} username={username} />
        <footer className="editor-footer">
          <p>Save your edits to update your CV. Public sharing is optional.</p>
          <Button
            className="studio-secondary"
            disabled={!dirty || busy}
            onClick={() => {
              if (window.confirm("Discard unpublished changes?")) {
                recovery.discard();
                resetDraft(saved.profile);
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
        <LibraryLabel htmlFor="cv-username" unstyled>
          Username
        </LibraryLabel>
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
        <LibraryLabel unstyled>
          <LibraryInput
            checked={isPublic}
            disabled={busy}
            onChange={(event) => setIsPublic(event.target.checked)}
            type="checkbox"
            unstyled
          />{" "}
          Publish my profile and CV at a public link
        </LibraryLabel>
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

function DraftPreview({ profile, username }: { profile: PortfolioProfile; username: string }) {
  return (
    <ResponsivePortfolioPreview appearance={profile.appearance}>
      <PreviewContent profile={profile} username={username} />
    </ResponsivePortfolioPreview>
  );
}

function initialSetup(profile: PortfolioProfile): SetupStep {
  return profile.templateChosen === false ? "template" : "done";
}
function recoveryKey(userId: string | undefined, profileId: string | undefined, saveUrl: string) {
  return userId ? `${recoveryPrefix}${userId}:${profileId ?? saveUrl}` : "";
}
async function readSaveResponse(
  response: Response,
  conflict: () => void,
): Promise<ProfileSnapshot> {
  const result = await response.json();
  if (response.status === 409) conflict();
  if (!response.ok) throw new Error(result.error ?? "Could not save. Your changes are still here.");
  return result;
}

function defaultProfession(profile: PortfolioProfile, profession?: PortfolioType): PortfolioType {
  return profession ?? profile.portfolioType ?? "engineer";
}

function onboardingCvLayout(profile: PortfolioProfile) {
  if (profile.templateChosen && profile.cvLayout) return profile.cvLayout;
  return (
    portfolioTypes.find((type) => type.id === (profile.portfolioType ?? "engineer"))?.cvLayout ??
    "classic"
  );
}
