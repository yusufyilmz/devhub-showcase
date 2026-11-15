"use client";

import { useEffect, useState } from "react";

import { urls } from "@shared/config/urls";
import {
  buildOwnerPortfolioKnowledge,
  buildPublicPortfolioKnowledge,
  type OwnerPortfolioKnowledge,
  type PublicPortfolioKnowledge,
} from "@shared/lib/profiles";
import { useStudioRequest } from "@shared/runtime/studio";
import { StudioButton } from "@shared/ui/button";
import { Card } from "@shared/ui/cards";
import { Input as LibraryInput } from "@shared/ui/input";
import { Label as LibraryLabel } from "@shared/ui/label";

export function AiProfileEditor({ readUrl = urls.studio.profile() }: { readUrl?: string }) {
  const request = useStudioRequest();
  const [data, setData] = useState<{
    owner: OwnerPortfolioKnowledge;
    public: PublicPortfolioKnowledge | null;
  } | null>(null);
  const [privateView, setPrivateView] = useState(false);
  const [error, showError] = useState("");
  const [refresh, setRefresh] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    showError("");
    setData(null);
    request(`${readUrl}?knowledge=1&refresh=${refresh}`, { signal: controller.signal })
      .then(async (response) => {
        const result = await response.json();
        if (!response.ok) throw new Error(result.error);
        if (!controller.signal.aborted)
          setData({
            owner: buildOwnerPortfolioKnowledge(result),
            public: result.publishedSnapshot
              ? buildPublicPortfolioKnowledge(result.publishedSnapshot)
              : null,
          });
      })
      .catch(() => {
        if (!controller.signal.aborted) showError("Could not load your saved AI profile.");
      });
    return () => controller.abort();
  }, [refresh, readUrl, request]);
  return (
    <Card asChild layout="plain" surface="portfolio">
      <section className="editor-card min-w-0 rounded-xl border border-border/75 bg-card p-md grid justify-items-start gap-sm [&>h2]:text-lg [&>h2]:font-semibold [&>p]:max-w-prose [&>p]:text-sm [&>p]:leading-relaxed [&>p]:text-muted-foreground">
        <h2>Your AI profile</h2>
        <p>
          Private knowledge uses your saved draft. Public knowledge uses the last explicitly
          published snapshot. Save or publish changes, then reload to inspect the corresponding
          revision. Building it does not call OpenAI.
        </p>
        <p>
          Public knowledge contains only visible portfolio content. The private owner profile
          includes your full saved document for the future studio assistant. This screen does not
          enable public chat.
        </p>
        <StudioButton
          onClick={() => setRefresh((value) => value + 1)}
          tone="secondary"
          type="button"
          variant="outline"
        >
          Reload saved AI profile
        </StudioButton>
        <LibraryLabel
          className="editor-checkbox flex items-center gap-2.5 text-xs text-muted-foreground [&_input]:size-4 [&_input]:accent-primary"
          unstyled
        >
          <LibraryInput
            checked={privateView}
            onChange={(event) => setPrivateView(event.target.checked)}
            type="checkbox"
            unstyled
          />{" "}
          Show private owner knowledge
        </LibraryLabel>
        {error && <p role="alert">{error}</p>}
        {!data && !error && <p role="status">Loading saved knowledge…</p>}
        {data && (
          <>
            <p>
              Saved revision {data.owner.source.revision} · Schema {data.owner.schemaVersion}
            </p>
            {!privateView && !data.public ? (
              <p>Your portfolio is private. No public AI knowledge is available.</p>
            ) : (
              <pre className="ai-profile-json w-full min-w-0 max-h-[34rem] overflow-auto rounded-lg border border-border/60 bg-muted/50 p-sm font-mono text-xs leading-relaxed wrap-anywhere whitespace-pre-wrap">
                {JSON.stringify(privateView ? data.owner : data.public, null, 2)}
              </pre>
            )}
          </>
        )}
      </section>
    </Card>
  );
}
