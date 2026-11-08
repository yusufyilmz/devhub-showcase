"use client";

import "./editor-workspace.css";

import { useState } from "react";

import { Button } from "@shared/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@shared/ui/dialog";
import { NativeSelect } from "@shared/ui/native-select";

import type { EditorWorkspaceProps } from "./types";

export function EditorWorkspace({
  active,
  actions,
  notice,
  view: controlledView,
  onViewChange,
  groups,
  username,
  disabled,
  locked = false,
  onNavigate,
  preview,
  children,
}: EditorWorkspaceProps) {
  const [localView, setLocalView] = useState<"edit" | "preview">("preview");
  const view = controlledView ?? localView;
  function changeView(next: "edit" | "preview") {
    setLocalView(next);
    onViewChange?.(next);
  }
  const group = groups.find((entry) => entry.items.includes(active));
  function navigate(next: string) {
    onNavigate(next);
    changeView("edit");
  }
  const options = groups.map((entry) => (
    <optgroup key={entry.label} label={entry.label}>
      {entry.items.map((item) => (
        <option key={item}>{item}</option>
      ))}
    </optgroup>
  ));
  return (
    <Dialog
      onOpenChange={(open) => {
        if (disabled || locked) return;
        changeView(open ? "edit" : "preview");
      }}
      open={view === "edit"}
    >
      <div className="editor-workspace" data-view={view}>
        <nav aria-label="Editor sections" className="editor-sidebar">
          <div className="editor-sidebar-identity">
            <p className="eyebrow">Your portfolio</p>
            <strong>{username || "Your draft"}</strong>
          </div>
          {groups.map((entry) => (
            <div className="editor-navigation-group" key={entry.label}>
              <p>{entry.label}</p>
              {entry.items.map((item) => (
                <Button
                  aria-current={active === item ? "page" : undefined}
                  disabled={disabled}
                  key={item}
                  onClick={() => navigate(item)}
                  type="button"
                  variant="ghost"
                >
                  {item}
                </Button>
              ))}
            </div>
          ))}
        </nav>
        <div className="editor-workspace-main">
          {view === "preview" && notice}
          <div className="editor-workspace-toolbar">
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
              {options}
            </NativeSelect>
            <DialogTrigger asChild>
              <Button disabled={disabled} type="button" variant="outline">
                Edit
              </Button>
            </DialogTrigger>
          </div>
          <aside aria-label="Draft preview" className="editor-preview-pane">
            {preview}
          </aside>
        </div>
        <DialogContent
          className="editor-lightbox"
          onEscapeKeyDown={(event) => {
            if (disabled || locked) event.preventDefault();
          }}
          onPointerDownOutside={(event) => {
            if (locked) event.preventDefault();
          }}
          showCloseButton={false}
        >
          <header className="editor-lightbox-header">
            <div>
              <DialogTitle>Edit {active}</DialogTitle>
              <DialogDescription>
                Changes stay in your private draft. Save when you’re ready.
              </DialogDescription>
            </div>
            {!locked && (
              <DialogClose asChild>
                <Button aria-label="Close editor" disabled={disabled} type="button" variant="ghost">
                  Back to preview
                </Button>
              </DialogClose>
            )}
            <NativeSelect
              aria-label="Editor section"
              disabled={disabled}
              onChange={(event) => navigate(event.target.value)}
              value={active}
            >
              {options}
            </NativeSelect>
          </header>
          <div className="editor-content-pane editor-lightbox-body">
            {notice}
            {children}
          </div>
          <footer className="editor-lightbox-footer">
            {!locked && (
              <DialogClose asChild>
                <Button disabled={disabled} type="button" variant="outline">
                  Done editing
                </Button>
              </DialogClose>
            )}
            {actions}
          </footer>
        </DialogContent>
      </div>
    </Dialog>
  );
}
