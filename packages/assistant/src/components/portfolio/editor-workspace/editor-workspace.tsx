"use client";

import "./editor-workspace.css";

import { type CSSProperties, useEffect, useId, useRef, useState } from "react";

import { Button } from "@shared/ui/button";
import { NativeSelect } from "@shared/ui/native-select";
import { SidebarInset, SidebarProvider } from "@shared/ui/sidebar";

import { EditorSidebar, EditorSidebarToggle } from "./editor-sidebar";
import type { EditorWorkspaceProps } from "./types";

export function EditorWorkspace({
  active,
  actions,
  notice,
  view: controlledView,
  onViewChange,
  groups,
  heading,
  sectionIcons,
  username,
  disabled,
  locked = false,
  onNavigate,
  preview,
  children,
}: EditorWorkspaceProps) {
  const [localView, setLocalView] = useState<"edit" | "preview">("preview");
  const toolbar = useRef<HTMLDivElement>(null);
  const viewButton = useRef<HTMLButtonElement>(null);
  const sectionListId = useId();
  const headingId = useId();
  const view = controlledView ?? localView;
  const editing = view === "edit";
  const group = groups.find((entry) => entry.items.includes(active));

  // biome-ignore lint/correctness/useExhaustiveDependencies: Bring the workspace into view when the section or view changes.
  useEffect(() => {
    const element = toolbar.current;
    if (!element) return;
    const { top, bottom } = element.getBoundingClientRect();
    const topOffset = Number.parseFloat(getComputedStyle(element).scrollMarginTop) || 0;
    if (top < topOffset || bottom > window.innerHeight) {
      element.scrollIntoView?.({ block: "start" });
    }
  }, [active, view]);

  function changeView(next: "edit" | "preview") {
    if (controlledView === undefined) setLocalView(next);
    onViewChange?.(next);
  }

  function navigate(next: string) {
    onNavigate(next);
    changeView("edit");
  }

  return (
    <SidebarProvider
      className="editor-workspace [&[data-slot='sidebar-wrapper']]:[min-height:100dvh]"
      data-view={view}
      style={
        {
          "--sidebar-width": "232px",
          "--sidebar-width-icon": "64px",
        } as CSSProperties
      }
    >
      <EditorSidebar
        active={active}
        disabled={disabled}
        groups={groups}
        onNavigate={navigate}
        sectionIcons={sectionIcons}
        sectionListId={sectionListId}
        username={username}
      />
      <SidebarInset className="editor-workspace-body [flex:1] [min-width:0]">
        {heading}
        <div className="editor-workspace-main [min-width:0] [overflow:clip] [background:var(--card)] [border:1px_solid_var(--border)] [border-radius:16px]">
          <div
            className="editor-workspace-toolbar [display:flex] [gap:16px] [align-items:center] [justify-content:space-between] [min-height:64px] [padding:12px_28px] [scroll-margin-top:4.25rem] [border-bottom:1px_solid_var(--border)] max-[767px]:[flex-wrap:wrap] [padding:16px]"
            ref={toolbar}
          >
            <EditorSidebarToggle controlsId={sectionListId} placement="toolbar" />
            <p className="editor-breadcrumb [font-size:12px] [color:var(--muted-foreground)] max-[767px]:[display:none]">
              {group?.label} / {active}
            </p>
            <NativeSelect
              aria-label="Editor section"
              className="editor-section-picker [display:none] max-[767px]:[display:block] [flex:1] [min-width:0]"
              disabled={disabled}
              onChange={(event) => navigate(event.target.value)}
              value={active}
            >
              {groups.map((entry) => (
                <optgroup key={entry.label} label={entry.label}>
                  {entry.items.map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </optgroup>
              ))}
            </NativeSelect>
            {!locked && (
              <Button
                disabled={disabled}
                onClick={() => changeView(editing ? "preview" : "edit")}
                ref={viewButton}
                type="button"
                variant="outline"
              >
                {editing ? "Back to preview" : "Edit"}
              </Button>
            )}
          </div>
          {notice}
          <aside
            aria-label="Draft preview"
            className="editor-preview-pane [min-width:0] [padding:24px] [background:var(--secondary)] [&_.draft-preview]:[padding:0] [margin:0] [background:transparent] [border:0] [&_.draft-preview_iframe]:[height:65dvh] max-[767px]:[padding:20px_16px]"
            hidden={editing}
          >
            {preview}
          </aside>
          {editing && (
            <section aria-labelledby={headingId}>
              <header className="editor-section-header [padding:24px_28px_0] [&_h2]:[font-size:20px] [font-weight:600] max-[767px]:[padding:20px_16px_0]">
                <h2 id={headingId}>Edit {active}</h2>
              </header>
              <div className="editor-content-pane [min-width:0] [padding:28px] [&_.editor-card]:[margin-bottom:20px] [&_.editor-body_>_.editor-card]:[margin-bottom:0] [&_.editor-card]:[min-width:0] [border-radius:12px] [&_.editor-collection-item]:[min-width:0] [&_.cv-preferences_>_h2]:[grid-column:1\_/\_-1] [&_.cv-preferences_>_p]:[grid-column:1\_/\_-1] [:where(&)_.cv-preferences_>_p]:[max-width:72ch]">
                {children}
              </div>
              <footer className="editor-section-actions [display:flex] [flex-wrap:wrap] [gap:10px] [align-items:center] [justify-content:flex-end] [padding:16px_28px] [border-top:1px_solid_var(--border)] [&_>_button]:[min-height:44px] max-[767px]:[padding:12px_16px] max-[767px]:[&_>_button]:[flex:1] [padding-inline:8px] [font-size:12px]">
                {!locked && (
                  <Button
                    disabled={disabled}
                    onClick={() => {
                      changeView("preview");
                      viewButton.current?.focus({ preventScroll: true });
                    }}
                    type="button"
                    variant="outline"
                  >
                    Done editing
                  </Button>
                )}
                {actions}
              </footer>
            </section>
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
