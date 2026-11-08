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
import { Button } from "@shared/ui/button";
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
      <section className="editor-card">
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
        <Button
          className="studio-secondary"
          onClick={() => setRefresh((value) => value + 1)}
          type="button"
          variant="outline"
        >
          Reload saved AI profile
        </Button>
        <LibraryLabel className="editor-checkbox" unstyled>
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
              <pre className="ai-profile-json">
                {JSON.stringify(privateView ? data.owner : data.public, null, 2)}
              </pre>
            )}
          </>
        )}
      </section>
    </Card>
  );
}
