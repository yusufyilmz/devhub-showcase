"use client";

import "@shared/ui/components.css";

import dynamic from "next/dynamic";
import { type ReactNode, useDeferredValue, useEffect, useState } from "react";

import {
  BookOpen,
  Bot,
  BriefcaseBusiness,
  Columns2,
  Eye,
  FileClock,
  FileDown,
  FileText,
  FileUp,
  FolderKanban,
  GraduationCap,
  History,
  Languages,
  LayoutGrid,
  ListOrdered,
  type LucideIcon,
  MessageSquareText,
  Palette,
  PanelsTopLeft,
  PlusSquare,
  Send,
  Settings2,
  Sparkles,
  UserRound,
  Wrench,
} from "lucide-react";

import {
  getPortfolioEntries,
  type PortfolioEntryId,
  type PortfolioProfile,
  type PortfolioType,
  portfolioTypes,
} from "@shared/config";
import { urls } from "@shared/config/urls";
import type { ProfileSnapshot } from "@shared/lib/profile";
import { createEmptyProfile, editCvPath } from "@shared/lib/profiles";
import { draftStorage } from "@shared/runtime/storage";
import { type StudioRequest, useStudioRequest } from "@shared/runtime/studio";
import { useUserConfigStore } from "@shared/runtime/user";
import { Button } from "@shared/ui/button";
import { Card } from "@shared/ui/cards";
import { GoogleImportEditor } from "@shared/ui/google-import";
import { Input } from "@shared/ui/input";
import { Label as LibraryLabel } from "@shared/ui/label";
import { AppearanceEditor } from "@shared/ui/theme/studio";

import { AgentCompanion } from "../../chat/agent-companion/index";
import { studioEditorGuide } from "../../companion/guides";
import {
  DraftPreviewPane,
  DraftRecovery,
  EditorGuidance,
  EditorWorkspace,
  FieldVisibilityEditor,
  LanguageSettingsEditor,
  PortfolioTypePicker,
  ProfileFields,
  type SetupStep,
  StudioHeading,
  TemplatePicker,
  useDraftRecovery,
  usePortfolioHistory,
} from "../../portfolio/index";
import { ResponsivePortfolioPreview } from "../../portfolio/portfolio-preview/index";
import {
  EducationEditor,
  ExperienceEditor,
  LanguagesEditor,
  ProjectsEditor,
  SkillsEditor,
} from "../../sections/index";
import {
  CustomSectionsEditor,
  SectionOrderEditor,
  SectionSettingsEditor,
  SectionsSettings,
  SectionTemplatesEditor,
} from "../../sections/studio/index";
import { AiAssistantEditor, AiProfileEditor, CvImportEditor, CvSettingsEditor } from "../index";

const PreviewContent = dynamic(() =>
  import("./preview-content").then((module) => module.PreviewContent),
);

import { PrivateCvVersions } from "./cv-versions";
import { PortfolioSetup, type SetupPosition } from "./portfolio-setup";
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
  "Publishing",
] as const;
const sectionIcons = {
  "AI assistant": Bot,
  "AI profile": Sparkles,
  Appearance: Palette,
  "Custom sections": PlusSquare,
  "CV versions": FileClock,
  Education: GraduationCap,
  Experience: BriefcaseBusiness,
  "Field visibility": Eye,
  "Import CV": FileUp,
  "Import Google": FileDown,
  "Language settings": Settings2,
  Languages,
  Layout: Columns2,
  PDF: FileText,
  Profile: UserRound,
  Projects: FolderKanban,
  Publishing: Send,
  Reviews: MessageSquareText,
  "Revision history": History,
  "Section display": PanelsTopLeft,
  "Section order": ListOrdered,
  Sections: LayoutGrid,
  Skills: Wrench,
  Templates: BookOpen,
} satisfies Record<(typeof tabs)[number], LucideIcon>;

const navigationGroups = [
  {
    items: [
      "Profile",
      "Experience",
      "Projects",
      "Education",
      "Skills",
      "Languages",
      "Reviews",
      "Custom sections",
    ],
    label: "Content",
  },
  {
    items: ["Layout", "Sections", "Appearance", "Section order", "Section display", "Templates"],
    label: "Design",
  },
  { items: ["PDF", "CV versions"], label: "CV" },
  {
    items: ["Import CV", "Import Google", "AI profile", "AI assistant", "Revision history"],
    label: "Tools & AI",
  },
  { items: ["Language settings", "Field visibility", "Publishing"], label: "Settings" },
] satisfies { label: string; items: (typeof tabs)[number][] }[];

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
type ScratchBackup = {
  profile: PortfolioProfile;
  profession: PortfolioType;
  tab: (typeof tabs)[number];
  username: string;
  view: "edit" | "preview";
};

function StartFromScratchAction({
  disabled,
  startingOver,
  showStart,
  onCancel,
  onStart,
}: {
  disabled: boolean;
  startingOver: boolean;
  showStart: boolean;
  onCancel: () => void;
  onStart: () => void;
}) {
  if (!startingOver && !showStart) return null;
  return (
    <Button
      className="studio-secondary"
      disabled={disabled}
      onClick={startingOver ? onCancel : onStart}
      type="button"
      variant="outline"
    >
      {startingOver ? "Cancel starting over" : "Start from scratch"}
    </Button>
  );
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
  const [scratchBackup, setScratchBackup] = useState<ScratchBackup | null>(null);
  const [step, setStep] = useState<SetupStep>(initialSetup(initial.profile));
  const [setupPosition, setSetupPosition] = useState<SetupPosition>({ section: 0, stage: 0 });
  const [saved, setSaved] = useState(initial);
  const [username, setUsername] = useState(initial.username ?? "");
  const [busy, setBusy] = useState(false);
  const { draft, setDraft, resetDraft, undo, redo, canUndo, canRedo } = usePortfolioHistory(
    initial.profile,
    busy,
  );
  const previewDraft = useDeferredValue(draft);
  const [isPublic, setIsPublic] = useState(initial.isPublic ?? false);
  const availableTabs = tabs.filter((item) => item !== "Reviews" || reviews);
  const [workspaceView, setWorkspaceView] = useState<"edit" | "preview">(() =>
    initialEditorView(initialTab),
  );
  const [assistantPrompt, setAssistantPrompt] = useState("");
  const [arrangeRequest, setArrangeRequest] = useState(0);
  const [tab, setTab] = useState<(typeof tabs)[number]>(initialTab);
  const request = useStudioRequest();
  const [message, setMessage] = useState("");
  const [error, showError] = useState("");
  const dirty = portfolioDirty(draft, saved, username);
  const recovery = useDraftRecovery({
    dirty,
    onRestore: (value) => {
      setWorkspaceView("edit");
      resetDraft(value.profile);
      setUsername(value.username);
      if (availableTabs.includes(value.tab as typeof tab)) setTab(value.tab as typeof tab);
      setStep(value.step);
      setSetupPosition(restoreSetupPosition(value.step, value.setupPosition));
      setProfession(defaultProfession(value.profile, value.profession));
    },
    revision: saved.revision,
    storageKey: recoveryKey(userId, initial.id, saveUrl),
    value: { isPublic, profession, profile: draft, setupPosition, step, tab, username },
  });
  const recoveryNeedsAttention = needsRecoveryAttention(recovery);
  const { editorDisabled, canSave } = editorSaveState(busy, recovery.stale, dirty);
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
  async function saveDraft(profile = draft) {
    const revision = await savePortfolioEditor({
      conflict: recovery.conflict,
      draft: profile,
      isPublic,
      managed,
      onSaved,
      request,
      resetDraft,
      saved,
      saveUrl,
      setBusy,
      setIsPublic,
      setMessage,
      setSaved,
      setUsername,
      setWorkspaceView,
      showError,
      stale: recovery.stale,
      username,
    });
    if (revision !== undefined) {
      recovery.saved(revision);
      setScratchBackup(null);
      setStep("done");
    }
  }
  function startFromScratch() {
    if (
      !window.confirm(
        "Start with a blank draft? Your saved portfolio stays as it is until you save changes.",
      )
    )
      return;
    setScratchBackup({ profession, profile: draft, tab, username, view: workspaceView });
    const blank = createEmptyProfile({ email: saved.profile.email });
    resetDraft({ ...blank, publicationVisibility: saved.profile.publicationVisibility });
    setProfession(defaultProfession(blank));
    setAssistantPrompt("");
    setSetupPosition({ section: 0, stage: 0 });
    showError("");
    setMessage("");
    setStep("template");
    setTab("Profile");
    setWorkspaceView("edit");
  }
  function cancelStartingOver() {
    if (!scratchBackup) return;
    recovery.discard();
    resetDraft(scratchBackup.profile);
    setProfession(scratchBackup.profession);
    setTab(scratchBackup.tab);
    setUsername(scratchBackup.username);
    setWorkspaceView(scratchBackup.view);
    setStep("done");
    showError("");
    setScratchBackup(null);
  }
  function arrangeLayout() {
    setWorkspaceView("preview");
    setArrangeRequest((count) => count + 1);
    document.getElementById("portfolio-draft-preview")?.scrollIntoView({ block: "start" });
  }
  const view = workspaceView;
  const editorActions = (
    <>
      <Button className="studio-primary" disabled={!canSave} type="submit">
        {busy ? "Saving…" : "Save changes"}
      </Button>
      <Button
        disabled={busy}
        onClick={() => {
          setTab("Publishing");
          setWorkspaceView("edit");
        }}
        type="button"
        variant="outline"
      >
        Review & publish
      </Button>
    </>
  );
  if (step !== "done") {
    const setupDraft = prepareSetupDraft(draft);
    return (
      <PortfolioSetup
        assistant={setupAssistant(managed, draft, setDraft, saved)}
        busy={busy}
        error={error}
        onCancel={scratchBackup ? cancelStartingOver : undefined}
        onChange={setDraft}
        onPosition={setSetupPosition}
        onProfession={(value) => {
          setProfession(value);
          setDraft({ ...draft, portfolioType: value });
        }}
        onSave={() => saveDraft(setupDraft)}
        position={setupPosition}
        preview={
          <DraftPreviewPane
            downloadHref={downloadHref}
            profile={setupDraft}
            showSavedDownload={false}
          >
            <ResponsivePortfolioPreview appearance={setupDraft.appearance} initiallyOpen>
              <PreviewContent profile={setupDraft} username={username} />
            </ResponsivePortfolioPreview>
          </DraftPreviewPane>
        }
        profession={profession}
        profile={draft}
        recovery={<DraftRecovery disabled={busy} recovery={recovery} />}
        stale={recovery.stale}
      />
    );
  }
  return (
    <main className="studio studio-editor" id="admin-content">
      <form
        id="portfolio-editor-form"
        onSubmit={async (event) => {
          event.preventDefault();
          await saveDraft();
        }}
      >
        <EditorWorkspace
          actions={editorActions}
          active={tab}
          disabled={busy}
          groups={navigationGroups.map((group) => ({
            ...group,
            items: group.items.filter((item) => availableTabs.includes(item)),
          }))}
          heading={
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
                  <StartFromScratchAction
                    disabled={editorDisabled}
                    onCancel={cancelStartingOver}
                    onStart={startFromScratch}
                    showStart={step === "done"}
                    startingOver={Boolean(scratchBackup)}
                  />
                  <Button className="studio-secondary" href="/admin/billing" variant="outline">
                    Plan and usage
                  </Button>

                  <div className="studio-editor-actions" hidden={view === "edit"}>
                    {editorActions}
                  </div>
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
                  onClick={() => signOutOfStudio(dirty, request, recovery.stop, showError, setBusy)}
                  type="button"
                >
                  Sign out
                </Button>
              </div>
            </StudioHeading>
          }
          notice={workspaceNotice(recovery, busy, message)}
          onNavigate={(next) => {
            setAssistantPrompt("");
            if (availableTabs.includes(next as typeof tab)) setTab(next as typeof tab);
          }}
          onViewChange={setWorkspaceView}
          preview={
            <DraftPreviewPane downloadHref={downloadHref} profile={previewDraft}>
              <DraftPreview
                arrangeRequest={arrangeRequest}
                disabled={editorDisabled}
                featured={initial.id === "main"}
                initiallyArranging={initiallyArranging}
                onChange={setDraft}
                profile={previewDraft}
                saveAction={
                  <Button disabled={!canSave} type="submit">
                    Save layout draft
                  </Button>
                }
                username={username}
              />
            </DraftPreviewPane>
          }
          sectionIcons={sectionIcons}
          username={username}
          view={view}
        >
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
              publication={
                <SharingSettings
                  busy={busy}
                  downloadHref={downloadHref}
                  managed={managed}
                  publication={
                    <ProfilePublication
                      dirty={dirty}
                      disabled={busy || recovery.stale}
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
              }
              readUrl={saveUrl}
              reviews={reviews}
              snapshot={saved}
              tab={tab}
            />
          </fieldset>
          <footer className="editor-footer">
            <p>
              Save your draft to update your CV. Publish separately to update the public version.
            </p>
            <Button
              className="studio-secondary"
              disabled={!canSave}
              onClick={() => {
                if (window.confirm("Discard unpublished changes?")) {
                  recovery.discard();
                  setScratchBackup(null);
                  setStep(initialSetup(saved.profile));
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
          <details className="editor-draft-tools">
            <summary>Draft tools · checklist, undo & recovery</summary>
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
            {!recoveryNeedsAttention && <DraftRecovery disabled={busy} recovery={recovery} />}
          </details>
        </EditorWorkspace>
      </form>
      {tab !== "AI assistant" && (
        <AgentCompanion
          agent="studio"
          guide={studioEditorGuide({
            ask: (prompt) => {
              setWorkspaceView("edit");
              setAssistantPrompt(prompt);
              setTab("AI assistant");
              document.querySelector(".editor-workspace")?.scrollIntoView({ block: "start" });
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
  publication,
  reviews,
  onNavigate,
  tab,
  snapshot,
  managed,
  readUrl,
  profile,
  onChange,
}: {
  assistantPrompt: string;
  onNavigate: (tab: string) => void;
  tab: (typeof tabs)[number];
  publication: ReactNode;
  reviews?: ReactNode;
  snapshot: ProfileSnapshot;
  managed: boolean;
  readUrl: string;
  profile: PortfolioProfile;
  onChange: (profile: PortfolioProfile) => void;
}) {
  if (tab === "Profile")
    return (
      <ProfileFields
        onChange={onChange}
        onImprove={() => onNavigate("AI assistant")}
        profile={profile}
      />
    );
  if (tab === "Sections") return <SectionsSettings onNavigate={onNavigate} profile={profile} />;
  if (tab === "Publishing") return publication;
  if (tab === "Reviews") return reviews;
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
      initiallyOpen
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

function portfolioDirty(draft: PortfolioProfile, saved: ProfileSnapshot, username: string) {
  return (
    JSON.stringify(draft) !== JSON.stringify(saved.profile) || username !== (saved.username ?? "")
  );
}

function restoreSetupPosition(step: SetupStep, position?: SetupPosition): SetupPosition {
  if (
    position &&
    Number.isInteger(position.stage) &&
    position.stage >= 0 &&
    position.stage <= 4 &&
    Number.isInteger(position.section) &&
    position.section >= 0 &&
    position.section <= 5
  )
    return position;
  if (step === "review") return { section: 0, stage: 4 };
  return { section: 0, stage: step === "details" ? 3 : 0 };
}

function prepareSetupDraft(profile: PortfolioProfile): PortfolioProfile {
  const locationMissing = !profile.location.trim() || profile.location === "Add your location";
  const summary =
    profile.summary.trim() === "Add a short professional summary." ? "" : profile.summary.trim();
  return {
    ...profile,
    cvFields: { email: false, ...profile.cvFields, ...(locationMissing && { location: false }) },
    cvLayout: onboardingCvLayout(profile),
    location: locationMissing ? "Not specified" : profile.location,
    summary: summary || profile.title.trim(),
    templateChosen: true,
    websiteFields: {
      email: false,
      ...profile.websiteFields,
      ...(locationMissing && { location: false }),
    },
  };
}

function setupAssistant(
  managed: boolean,
  profile: PortfolioProfile,
  onChange: (profile: PortfolioProfile) => void,
  saved: ProfileSnapshot,
) {
  if (managed) return undefined;
  return (
    <AiAssistantEditor
      initialMessage="Help me write a short portfolio introduction. Ask what I do and what I’ve worked on before drafting. Use only details I provide."
      managed={false}
      onChange={(next) => onChange({ ...profile, summary: next.summary })}
      profile={profile}
      profileId={saved.id}
      revision={saved.revision}
    />
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

function needsRecoveryAttention(recovery: ReturnType<typeof useDraftRecovery>) {
  return Boolean(recovery.candidate) || recovery.stale || recovery.status === "failed";
}

function initialEditorView(_tab: string): "edit" | "preview" {
  return "preview";
}

async function savePortfolioEditor(input: {
  conflict: () => void;
  draft: PortfolioProfile;
  isPublic: boolean;
  managed: boolean;
  onSaved?: (snapshot: ProfileSnapshot) => void;
  request: StudioRequest;
  resetDraft: (profile: PortfolioProfile) => void;
  saveUrl: string;
  saved: ProfileSnapshot;
  setBusy: (busy: boolean) => void;
  setIsPublic: (value: boolean) => void;
  setMessage: (message: string) => void;
  setSaved: (snapshot: ProfileSnapshot) => void;
  setUsername: (username: string) => void;
  setWorkspaceView: (view: "edit" | "preview") => void;
  showError: (message: string) => void;
  stale: boolean;
  username: string;
}) {
  if (input.stale) return;
  input.setBusy(true);
  input.showError("");
  input.setMessage("");
  try {
    const response = await input.request(input.saveUrl, {
      body: JSON.stringify({
        profile: clean(input.draft),
        revision: input.saved.revision,
        ...(input.username ? { username: input.username } : {}),
      }),
      headers: { "Content-Type": "application/json" },
      method: "PUT",
    });
    const result = await readSaveResponse(response, input.conflict);
    if (!input.managed && result.username && result.username !== input.saved.username)
      window.history.replaceState(null, "", editCvPath(result.username));
    input.setUsername(result.username ?? input.username);
    input.setSaved(result);
    input.resetDraft(result.profile);
    input.setIsPublic(result.isPublic ?? input.isPublic);
    input.setMessage("Saved privately. Review publication to update your public website and CV.");
    input.onSaved?.(result);
    return result.revision;
  } catch (reason) {
    input.setWorkspaceView("edit");
    input.showError(
      reason instanceof Error ? reason.message : "Could not publish. Your changes are still here.",
    );
  } finally {
    input.setBusy(false);
  }
}

async function signOutOfStudio(
  dirty: boolean,
  request: StudioRequest,
  stopRecovery: () => void,
  showError: (message: string) => void,
  setBusy: (busy: boolean) => void,
) {
  if (dirty && !window.confirm("Leave without publishing your changes?")) return;
  setBusy(true);
  try {
    const response = await request(urls.auth.session(), { method: "DELETE" });
    if (!response.ok) throw new Error("Could not sign out.");
    stopRecovery();
    draftStorage.clear();
    useUserConfigStore.getState().clearUser();
    window.location.assign("/login");
  } catch (reason) {
    showError(reason instanceof Error ? reason.message : "Could not sign out.");
    setBusy(false);
  }
}

function editorSaveState(busy: boolean, stale: boolean, dirty: boolean) {
  const editorDisabled = busy || stale;
  return { canSave: dirty && !editorDisabled, editorDisabled };
}

function workspaceNotice(
  recovery: ReturnType<typeof useDraftRecovery>,
  disabled: boolean,
  message: string,
) {
  return (
    <>
      {needsRecoveryAttention(recovery) && (
        <DraftRecovery disabled={disabled} recovery={recovery} />
      )}
      {message && (
        <p className="editor-success" role="status">
          {message}
        </p>
      )}
    </>
  );
}
