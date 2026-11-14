"use client";

import { BookOpen } from "lucide-react";

import { Button } from "@shared/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@shared/ui/dialog";

import type { AgentFeature, AgentGuide } from "./types";

export function FeatureAction({
  action,
  onSelect,
}: {
  action: NonNullable<AgentFeature["action"]>;
  onSelect?: () => void;
}) {
  if ("href" in action)
    return (
      <a href={action.href} onClick={onSelect}>
        {action.label}
      </a>
    );
  return (
    <Button
      onClick={() => {
        onSelect?.();
        action.onSelect();
      }}
      type="button"
      variant="outline"
    >
      {action.label}
    </Button>
  );
}

export function FeatureGuide({
  guide,
  features,
  completed,
  open,
  setOpen,
  enabled,
  setEnabled,
  loaded,
  error,
  onComplete,
  retry,
}: {
  guide: AgentGuide;
  features: readonly AgentFeature[];
  completed: readonly string[];
  open: boolean;
  setOpen: (open: boolean) => void;
  enabled: boolean;
  setEnabled: (enabled: boolean) => void;
  loaded: boolean;
  error: boolean;
  onComplete: (id: string) => Promise<void>;
  retry: () => void;
}) {
  const groups = new Map<string, AgentFeature[]>();
  for (const feature of features) {
    const group = groups.get(feature.group) ?? [];
    group.push(feature);
    groups.set(feature.group, group);
  }
  const count = features.filter((feature) => completed.includes(feature.id)).length;

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger asChild>
        <Button
          aria-label="Open feature guide"
          className="agent-guide-toggle"
          title="Feature guide"
          type="button"
          variant="unstyled"
        >
          <BookOpen aria-hidden="true" size={17} />
        </Button>
      </DialogTrigger>
      <DialogContent className="agent-guide-dialog [z-index:260] [display:flex] [flex-direction:column] [width:min(34rem,_calc(100vw_-_2rem))] [max-height:86dvh]">
        <DialogHeader>
          <DialogTitle>{guide.title}</DialogTitle>
          <DialogDescription>
            {guide.progressHref
              ? `${count} of ${features.length} features used. Unfinished features are suggested first.`
              : "Explore what you can do here."}
          </DialogDescription>
        </DialogHeader>
        <Button onClick={() => setEnabled(!enabled)} type="button" variant="outline">
          {enabled ? "Turn off automatic tips" : "Turn on automatic tips"}
        </Button>
        {error && (
          <div
            className="agent-guide-error [display:flex] [flex-wrap:wrap] [gap:0.625rem] [align-items:center]"
            role="status"
          >
            <p>Couldn’t sync your progress.</p>
            <Button onClick={retry} type="button" variant="outline">
              Try again
            </Button>
          </div>
        )}
        <div className="agent-guide-list [min-height:0] [padding-inline-end:0.35rem] [overflow:auto] [overscroll-behavior:contain] [&_section_+_section]:[margin-block-start:1.25rem] [&_h3]:[margin-block-end:0.5rem] [font-size:1rem] [font-weight:650] [&_li]:[padding-block:0.75rem] [border-top:1px_solid_var(--border)] [&_li_p]:[margin-block:0.25rem_0.5rem] [font-size:0.875rem] [line-height:1.5] [color:var(--muted-foreground)]">
          {[...groups].map(([group, items]) => (
            <section key={group}>
              <h3>{group}</h3>
              <ul>
                {items.map(({ id, title, message, action }) => {
                  const used = completed.includes(id);
                  return (
                    <li key={id}>
                      <strong>{title}</strong>
                      <p>{message}</p>
                      <div className="agent-guide-actions [display:flex] [flex-wrap:wrap] [gap:0.625rem] [align-items:center] [&_a]:[text-decoration:underline] [text-underline-offset:0.15rem]">
                        {action && (
                          <FeatureAction action={action} onSelect={() => setOpen(false)} />
                        )}
                        {guide.progressHref &&
                          (used ? (
                            <span>Used</span>
                          ) : (
                            <Button
                              aria-label={`Mark ${title} as used`}
                              disabled={!loaded}
                              onClick={() => void onComplete(id)}
                              type="button"
                              variant="outline"
                            >
                              Mark as used
                            </Button>
                          ))}
                      </div>
                    </li>
                  );
                })}
              </ul>
            </section>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
