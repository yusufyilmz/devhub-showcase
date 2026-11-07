"use client";

import "@shared/ui/components.css";

import dynamic from "next/dynamic";
import { type ReactNode, useEffect, useState } from "react";

import { AiAssistantEditor, AiProfileEditor } from "@shared/assistant/studio";
import {
  getPortfolioEntries,
  type PortfolioEntryId,
  type PortfolioProfile,
  type PortfolioType,
  portfolioTypes,
} from "@shared/config";
import { urls } from "@shared/config/urls";
import { editCvPath } from "@shared/lib/profiles";
import { draftStorage } from "@shared/runtime/storage";
import { useStudioRequest } from "@shared/runtime/studio";
import { useUserConfigStore } from "@shared/runtime/user";
import type { ProfileSnapshot } from "@shared/services/profile";
import { CvImportEditor, CvSettingsEditor } from "@shared/templates/studio";
import { AgentCompanion } from "@shared/ui/agent-companion";
import { Button } from "@shared/ui/button";
import { Card } from "@shared/ui/cards";
import { GoogleImportEditor } from "@shared/ui/google-import";
import { Input } from "@shared/ui/input";
import { Label as LibraryLabel } from "@shared/ui/label";
import {
  DraftRecovery,
  EditorGuidance,
  FieldVisibilityEditor,
  GuidedOnboarding,
  LanguageSettingsEditor,
  PortfolioTypePicker,
  ProfileFields,
  SetupNavigation,
  type SetupStep,
  StudioHeading,
  TemplatePicker,
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
  SectionsSettings,
  SectionTemplatesEditor,
} from "@shared/ui/sections/studio";
import { AppearanceEditor } from "@shared/ui/theme/studio";

import { studioEditorGuide } from "@/features/companion/guides";
import { StudioCompanion } from "@/features/companion/studio-companion";

const PreviewContent = dynamic(() =>
  import("./preview-content").then((module) => module.PreviewContent),
);

import { PrivateCvVersions } from "./cv-versions";
import { ProfilePublication } from "./publication";
import { OwnerRevisionHistory } from "./revision-history";

const tabs = [
  "Profile",
  "Reviews",
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
  "Sections",
  "Section order",
  "Section display",
  "Custom sections",
  "Templates",
  "Appearance",
  "PDF",
  "CV versions",
  "Revision history",
  "Field visibility",
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
  saveUrl = urls.studio.profile(),
  downloadHref = urls.studio.cv(),
  managed = false,
  onSaved,
  initialTab = "Profile",
  initiallyArranging = false,
  reviews,
}: {
  initial: ProfileSnapshot;
  saveUrl?: string;
  downloadHref?: string;
  managed?: boolean;
  onSaved?: (snapshot: ProfileSnapshot) => void;
  initialTab?: (typeof tabs)[number];
  initiallyArranging?: boolean;
  reviews?: ReactNode;
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
  const availableTabs = tabs.filter((item) => item !== "Reviews" || reviews);
  const [tab, setTab] = useState<(typeof tabs)[number]>(initialTab);
  const [assistantPrompt, setAssistantPrompt] = useState("");
  const [arrangeRequest, setArrangeRequest] = useState(0);
  const request = useStudioRequest();
  const [message, setMessage] = useState("");
  const [error, showError] = useState("");
  const dirty =
    JSON.stringify(draft) !== JSON.stringify(saved.profile) || username !== (saved.username ?? "");
  const recovery = useDraftRecovery({
    dirty,
    onRestore: (value) => {
      resetDraft(value.profile);
      setUsername(value.username);
      if (availableTabs.includes(value.tab as typeof tab)) setTab(value.tab as typeof tab);
      setStep(value.step);
      setProfession(defaultProfession(value.profile, value.profession));
    },
    revision: saved.revision,
    storageKey: recoveryKey(userId, initial.id, saveUrl),
    value: { isPublic, profession, profile: draft, step, tab, username },
  });
  const editorDisabled = busy || recovery.stale;
  const canSave = dirty && !editorDisabled;
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
      setMessage("Saved privately. Review publication to update your public website and CV.");
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
  function arrangeLayout() {
    setArrangeRequest((count) => count + 1);
    document.getElementById("portfolio-draft-preview")?.scrollIntoView({ block: "start" });
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
      <>
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
        <StudioCompanion signedIn />
      </>
    );
  return (
    <main className="studio" id="admin-content">
      <form
        onSubmit={async (event) => {
          event.preventDefault();
          await publish();
        }}
      >
        <StudioHeading
          actions={
            <>
              <Button
                className="studio-secondary"
                disabled={editorDisabled}
                onClick={arrangeLayout}
                type="button"
                variant="outline"
              >
                Arrange layout
              </Button>
              <Button className="studio-secondary" href="/admin/billing" variant="outline">
                Plan and usage
              </Button>

              <Button className="studio-primary" disabled={!canSave} type="submit">
                {busy ? "Saving…" : "Save changes"}
              </Button>
            </>
          }
          description="Update your story, tailor your CV, and preview what you want to share."
          eyebrow="Portfolio editor"
          title="Edit your portfolio"
        >
          <div className="studio-status">
            <span className={dirty ? "status-dot unsaved" : "status-dot"} />
            <span>{dirty ? "You have unsaved changes" : "All changes saved"}</span>
            <span>Revision {saved.revision}</span>
            <Button
              disabled={busy}
              onClick={async () => {
                if (dirty && !window.confirm("Leave without publishing your changes?")) return;
                setBusy(true);
                try {
                  const response = await request(urls.auth.session(), {
                    method: "DELETE",
                  });
                  if (!response.ok) throw new Error("Could not sign out.");
                  recovery.stop();
                  draftStorage.clear();
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
        </StudioHeading>
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
              const heading = document.querySelector<HTMLElement>(".editor-body h2");
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
          managed={managed}
          publication={
            <ProfilePublication
              dirty={dirty}
              disabled={editorDisabled}
              id={saved.id}
              managed={managed}
              onChanged={(value) => {
                setIsPublic(value);
                setSaved((previous) => ({ ...previous, isPublic: value }));
              }}
              profile={saved.profile}
              revision={saved.revision}
            />
          }
          setUsername={setUsername}
          username={username}
        />
        <nav aria-label="Editor sections" className="editor-tabs">
          {availableTabs.map((item) => (
            <Button
              aria-current={tab === item ? "page" : undefined}
              key={item}
              onClick={() => {
                setAssistantPrompt("");
                setTab(item);
              }}
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
            assistantPrompt={assistantPrompt}
            managed={managed}
            onChange={setDraft}
            onNavigate={(next) => {
              if (availableTabs.includes(next as typeof tab)) setTab(next as typeof tab);
            }}
            profile={draft}
            readUrl={saveUrl}
            reviews={reviews}
            snapshot={saved}
            tab={tab}
          />
        </fieldset>
        <DraftPreview
          arrangeRequest={arrangeRequest}
          disabled={editorDisabled}
          featured={initial.id === "main"}
          initiallyArranging={initiallyArranging}
          onChange={setDraft}
          profile={draft}
          saveAction={
            <Button disabled={!canSave} type="submit">
              Save layout draft
            </Button>
          }
          username={username}
        />
        <div className="editor-save-bar">
          <div>
            <strong>Your saved draft</strong>
            <p>Save to update your CV. You can publish your portfolio when you’re ready.</p>
          </div>
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
        </div>
      </form>
      {tab !== "AI assistant" && (
        <AgentCompanion
          agent="studio"
          guide={studioEditorGuide({
            ask: (prompt) => {
              setAssistantPrompt(prompt);
              setTab("AI assistant");
              document.querySelector(".editor-tabs")?.scrollIntoView({ block: "start" });
            },
            draft,
            managed,
            paused: busy,
            preview: arrangeLayout,
            saved,
            tab,
          })}
          href="/admin/chat"
          label="Open Studio assistant"
          notice={
            message
              ? { announce: false, id: `saved:${saved.revision}`, message, title: "Studio update" }
              : undefined
          }
        />
      )}
    </main>
  );
}

function EditorBody({
  assistantPrompt,
  onNavigate,
  tab,
  snapshot,
  managed,
  readUrl,
  reviews,
  profile,
  onChange,
}: {
  assistantPrompt: string;
  onNavigate: (tab: string) => void;
  tab: (typeof tabs)[number];
  reviews?: ReactNode;
  snapshot: ProfileSnapshot;
  managed: boolean;
  readUrl: string;
  profile: PortfolioProfile;
  onChange: (profile: PortfolioProfile) => void;
}) {
  if (tab === "Reviews") return reviews;
  if (tab === "Sections") return <SectionsSettings onNavigate={onNavigate} profile={profile} />;
  if (tab === "Revision history")
    return (
      <OwnerRevisionHistory
        managedId={managed ? snapshot.id : undefined}
        onChange={onChange}
        profile={profile}
        revision={snapshot.revision}
      />
    );
  if (tab === "CV versions")
    return managed ? (
      <Card>
        CV versions belong to your own account workspace. Open your personal editor to manage them.
      </Card>
    ) : (
      <PrivateCvVersions profile={profile} sourceRevision={snapshot.revision} />
    );
  if (tab === "AI assistant")
    return (
      <AiAssistantEditor
        initialMessage={assistantPrompt}
        managed={managed}
        onChange={onChange}
        onNavigate={onNavigate}
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
  username,
  setUsername,
  publication,
  busy,
  downloadHref,
  managed,
}: {
  username: string;
  setUsername: (value: string) => void;
  publication: React.ReactNode;
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
          The public link changes only when you publish the saved username.
        </p>
        {publication}
        <Button className="studio-secondary" href={downloadHref} variant="outline">
          Download my saved CV
        </Button>
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
        <TemplatePicker onChange={onChange} profile={profile} />
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
  "Field visibility": FieldVisibilityEditor,
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

function DraftPreview({
  arrangeRequest,
  disabled,
  featured,
  initiallyArranging,
  onChange,
  profile,
  saveAction,
  username,
}: {
  arrangeRequest: number;
  disabled: boolean;
  featured: boolean;
  initiallyArranging: boolean;
  onChange: (profile: PortfolioProfile) => void;
  profile: PortfolioProfile;
  saveAction: ReactNode;
  username: string;
}) {
  const [arranging, setArranging] = useState(initiallyArranging);
  useEffect(() => {
    if (arrangeRequest) setArranging(true);
  }, [arrangeRequest]);
  function arrangeVisibleSections(order: PortfolioEntryId[]) {
    const moved = new Set(order);
    const remaining = order.values();
    const sectionSequence = getPortfolioEntries(profile).map(({ id }) =>
      moved.has(id) ? (remaining.next().value ?? id) : id,
    );
    onChange({ ...profile, sectionSequence });
  }

  return (
    <ResponsivePortfolioPreview
      appearance={profile.appearance}
      arrange={{
        active: arranging,
        disabled,
        onToggle: () => setArranging(!arranging),
        saveAction,
      }}
      initiallyOpen={initiallyArranging}
      openRequest={arrangeRequest}
    >
      <PreviewContent
        arrange={arranging ? { disabled, onChange: arrangeVisibleSections } : undefined}
        featured={featured}
        profile={profile}
        username={username}
      />
    </ResponsivePortfolioPreview>
  );
}

function initialSetup(profile: PortfolioProfile): SetupStep {
  return profile.templateChosen === false ? "template" : "done";
}
function recoveryKey(userId: string | undefined, profileId: string | undefined, saveUrl: string) {
  return userId ? draftStorage.key(userId, profileId ?? saveUrl) : "";
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
