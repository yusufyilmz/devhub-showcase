"use client";

import "@shared/ui/components.css";

import dynamic from "next/dynamic";
import { type ReactNode, useDeferredValue, useEffect, useState } from "react";

import {
  getPortfolioEntries,
  type PortfolioEntryId,
  type PortfolioProfile,
  type PortfolioType,
  portfolioTypes,
} from "@shared/config";
import { urls } from "@shared/config/urls";
import type { ProfileSnapshot } from "@shared/lib/profile";
import { editCvPath } from "@shared/lib/profiles";
import { draftStorage } from "@shared/runtime/storage";
import { type StudioRequest, useStudioRequest } from "@shared/runtime/studio";
import { useUserConfigStore } from "@shared/runtime/user";
import { Button } from "@shared/ui/button";
import { Card } from "@shared/ui/cards";
import { Dialog, DialogContent, DialogTitle } from "@shared/ui/dialog";
import { GoogleImportEditor } from "@shared/ui/google-import";
import { Input } from "@shared/ui/input";
import { Label as LibraryLabel } from "@shared/ui/label";
import { AppearanceEditor } from "@shared/ui/theme/studio";

import { AgentCompanion } from "../../chat/agent-companion/index";
import { studioEditorGuide } from "../../companion/guides";
import { StudioCompanion } from "../../companion/studio-companion";
import {
  DraftPreviewPane,
  DraftRecovery,
  EditorGuidance,
  EditorWorkspace,
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
function openStartStep(
  next: "work" | "layout" | "start",
  setReached: (update: (current: number) => number) => void,
  setStartStep: (next: "work" | "layout" | "start") => void,
  setStep: (next: SetupStep) => void,
) {
  setReached((current) => Math.max(current, ["work", "layout", "start"].indexOf(next)));
  setStartStep(next);
  setStep("template");
}
function setupReached(step: SetupStep) {
  if (step === "review" || step === "done") return 4;
  if (step === "details") return 3;
  return 0;
}

function FirstPortfolioDialog({
  busy,
  draft,
  managed,
  onBegin,
  onProfessionChange,
  onReview,
  onStartStep,
  profession,
  reached,
  recovery,
  resetDraft,
  startStep,
}: {
  busy: boolean;
  draft: PortfolioProfile;
  managed: boolean;
  onBegin: (tab?: "Profile" | "Import CV" | "Import Google") => void;
  onProfessionChange: (value: PortfolioType) => void;
  onReview: () => void;
  onStartStep: (next: "work" | "layout" | "start") => void;
  profession: PortfolioType;
  reached: number;
  recovery: ReturnType<typeof useDraftRecovery>;
  resetDraft: (profile: PortfolioProfile) => void;
  startStep: "work" | "layout" | "start";
}) {
  return (
    <>
      <Dialog open>
        <DialogContent
          className="setup-dialog"
          onEscapeKeyDown={(event) => event.preventDefault()}
          onPointerDownOutside={(event) => event.preventDefault()}
          showCloseButton={false}
        >
          <DialogTitle className="sr-only">Create your portfolio</DialogTitle>
          <GuidedOnboarding
            managed={managed}
            onChange={resetDraft}
            onContinue={() => onBegin()}
            onGoogleImport={() => onBegin("Import Google")}
            onImport={() => onBegin("Import CV")}
            onOpen={(next) => {
              onBegin();
              if (next === "review") onReview();
            }}
            onProfessionChange={onProfessionChange}
            onStartStep={onStartStep}
            profession={profession}
            profile={draft}
            reached={reached}
            startStep={startStep}
          >
            <DraftRecovery disabled={busy} recovery={recovery} />
          </GuidedOnboarding>
        </DialogContent>
      </Dialog>
      <StudioCompanion signedIn />
    </>
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
  const [step, setStep] = useState<SetupStep>(initialSetup(initial.profile));
  const [startStep, setStartStep] = useState<"work" | "layout" | "start">("work");
  const [reached, setReached] = useState(() => setupReached(initialSetup(initial.profile)));
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
      setReached((current) => Math.max(current, setupReached(value.step)));
      setProfession(defaultProfession(value.profile, value.profession));
    },
    revision: saved.revision,
    storageKey: recoveryKey(userId, initial.id, saveUrl),
    value: { isPublic, profession, profile: draft, step, tab, username },
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
  async function publish() {
    const revision = await savePortfolioEditor({
      conflict: recovery.conflict,
      draft,
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
    if (revision !== undefined) recovery.saved(revision);
  }
  function arrangeLayout() {
    setWorkspaceView("preview");
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
    setReached((current) => Math.max(current, 3));
    setWorkspaceView("edit");
    setStep("details");
  }
  function openStart(next: "work" | "layout" | "start") {
    openStartStep(next, setReached, setStartStep, setStep);
  }
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
  if (step === "template")
    return (
      <FirstPortfolioDialog
        busy={busy}
        draft={draft}
        managed={managed}
        onBegin={beginDetails}
        onProfessionChange={(value) => {
          setProfession(value);
          resetDraft({ ...draft, portfolioType: value });
        }}
        onReview={() => {
          setReached((current) => Math.max(current, 4));
          setStep("review");
        }}
        onStartStep={openStart}
        profession={profession}
        reached={reached}
        recovery={recovery}
        resetDraft={resetDraft}
        startStep={startStep}
      />
    );
  return (
    <main className="studio studio-editor" id="admin-content">
      <form
        id="portfolio-editor-form"
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

              <div className="studio-editor-actions">{editorActions}</div>
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
        <EditorWorkspace
          actions={editorActions}
          active={tab}
          disabled={busy}
          groups={navigationGroups.map((group) => ({
            ...group,
            items: group.items.filter((item) => availableTabs.includes(item)),
          }))}
          locked={setupStepLocksEditor(step)}
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
          username={username}
          view={editorWorkspaceView(step, workspaceView)}
        >
          <SetupNavigation
            canReview={draft.name.trim().length > 0 && draft.title.trim().length > 0}
            disabled={busy}
            onImport={() => {
              setTab("Import CV");
            }}
            onManual={() => {
              setTab("Profile");
            }}
            onOpen={openStart}
            onStep={(next) => {
              if (next === "review") setReached((current) => Math.max(current, 4));
              if (next === "template") openStart("layout");
              else {
                setWorkspaceView("edit");
                setStep(next);
              }
              if (next === "review") setTab("Profile");
            }}
            reached={reached}
            step={step}
          />
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

function setupStepLocksEditor(step: SetupStep) {
  return step === "details" || step === "review";
}

function editorWorkspaceView(step: SetupStep, view: "edit" | "preview") {
  return setupStepLocksEditor(step) ? "edit" : view;
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
  return "edit";
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
