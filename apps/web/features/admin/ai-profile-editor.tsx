"use client";
import { useEffect, useState } from "react";

import {
  buildOwnerPortfolioKnowledge,
  buildPublicPortfolioKnowledge,
  type OwnerPortfolioKnowledge,
  type PublicPortfolioKnowledge,
} from "@shared/lib/portfolio-knowledge";
export function AiProfileEditor({ readUrl = "/api/admin/profile" }: { readUrl?: string }) {
  const [data, setData] = useState<{
    owner: OwnerPortfolioKnowledge;
    public: PublicPortfolioKnowledge | null;
  } | null>(null);
  const [privateView, setPrivateView] = useState(false);
  const [error, setError] = useState("");
  const [refresh, setRefresh] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    setError("");
    setData(null);
    fetch(`${readUrl}?refresh=${refresh}`, { signal: controller.signal })
      .then(async (response) => {
        const result = await response.json();
        if (!response.ok) throw new Error(result.error);
        if (!controller.signal.aborted)
          setData({
            owner: buildOwnerPortfolioKnowledge(result),
            public: buildPublicPortfolioKnowledge(result),
          });
      })
      .catch(() => {
        if (!controller.signal.aborted) setError("Could not load your saved AI profile.");
      });
    return () => controller.abort();
  }, [refresh, readUrl]);
  return (
    <section className="editor-card">
      <h2>Your AI profile</h2>
      <p>
        This knowledge is derived from your saved information. Save draft changes, then reload to
        inspect the new revision. Building it does not call OpenAI.
      </p>
      <p>
        Public knowledge contains only visible portfolio content. The private owner profile includes
        your full saved document for the future studio assistant. This screen does not enable public
        chat.
      </p>
      <button
        className="studio-secondary"
        onClick={() => setRefresh((value) => value + 1)}
        type="button"
      >
        Reload saved AI profile
      </button>
      <label className="editor-checkbox">
        <input
          checked={privateView}
          onChange={(event) => setPrivateView(event.target.checked)}
          type="checkbox"
        />{" "}
        Show private owner knowledge
      </label>
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
  );
}
