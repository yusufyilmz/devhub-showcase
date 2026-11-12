"use client";

import "./editor-workspace.css";

import { useEffect, useId, useRef, useState } from "react";

import { FileText, PanelLeftClose, PanelLeftOpen } from "lucide-react";

import { Button } from "@shared/ui/button";
import { NativeSelect } from "@shared/ui/native-select";

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
  const [compact, setCompact] = useState(false);
  const toolbar = useRef<HTMLDivElement>(null);
  const viewButton = useRef<HTMLButtonElement>(null);
  const sectionListId = useId();
  const headingId = useId();
  const view = controlledView ?? localView;
  const editing = view === "edit";
  const group = groups.find((entry) => entry.items.includes(active));
  const sidebarLabel = compact ? "Expand sidebar" : "Collapse sidebar";
  const SidebarIcon = compact ? PanelLeftOpen : PanelLeftClose;

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
    <div className="editor-workspace" data-sidebar-compact={compact} data-view={view}>
      <nav aria-label="Editor sections" className="editor-sidebar">
        <div className="editor-sidebar-header">
          {!compact && (
            <div className="editor-sidebar-identity">
              <p className="eyebrow">Your portfolio</p>
              <strong>{username || "Your draft"}</strong>
            </div>
          )}
          <Button
            aria-controls={sectionListId}
            aria-expanded={!compact}
            aria-label={sidebarLabel}
            onClick={() => setCompact((previous) => !previous)}
            size="icon"
            title={sidebarLabel}
            type="button"
            variant="ghost"
          >
            <SidebarIcon aria-hidden="true" />
          </Button>
        </div>
        <div className="editor-sidebar-sections" id={sectionListId}>
          {groups.map((entry) => (
            <div className="editor-navigation-group" key={entry.label}>
              {!compact && <p>{entry.label}</p>}
              {entry.items.map((item) => {
                const Icon = sectionIcons?.[item] ?? FileText;
                return (
                  <Button
                    aria-current={active === item ? "page" : undefined}
                    aria-label={compact ? item : undefined}
                    disabled={disabled}
                    key={item}
                    onClick={() => navigate(item)}
                    title={compact ? item : undefined}
                    type="button"
                    variant="ghost"
                  >
                    {compact ? <Icon aria-hidden="true" /> : item}
                  </Button>
                );
              })}
            </div>
          ))}
        </div>
      </nav>
      <div className="editor-workspace-body">
        {heading}
        <div className="editor-workspace-main">
          <div className="editor-workspace-toolbar" ref={toolbar}>
            <p className="editor-breadcrumb">
              {group?.label} / {active}
            </p>
            <NativeSelect
              aria-label="Editor section"
              className="editor-section-picker"
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
          <aside aria-label="Draft preview" className="editor-preview-pane" hidden={editing}>
            {preview}
          </aside>
          {editing && (
            <section aria-labelledby={headingId}>
              <header className="editor-section-header">
                <h2 id={headingId}>Edit {active}</h2>
              </header>
              <div className="editor-content-pane">{children}</div>
              <footer className="editor-section-actions">
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
      </div>
    </div>
  );
}
