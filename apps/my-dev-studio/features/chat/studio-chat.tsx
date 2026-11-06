"use client";

import { useEffect, useState } from "react";

import { AiAssistantEditor } from "@shared/assistant/studio";
import { urls } from "@shared/config/urls";
import { editCvPath } from "@shared/lib/profiles";
import { useStudioRequest } from "@shared/runtime/studio";
import type { ProfileSnapshot } from "@shared/services/profile";
import { Button } from "@shared/ui/button";

export function StudioChat({ initial }: { initial: ProfileSnapshot }) {
  const [saved, setSaved] = useState(initial);
  const [draft, setDraft] = useState(initial.profile);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");
  const request = useStudioRequest();
  const dirty = JSON.stringify(draft) !== JSON.stringify(saved.profile);
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
  async function save() {
    if (saving || !dirty) return;
    setSaving(true);
    setError("");
    setStatus("");
    try {
      const response = await request(urls.studio.profile(), {
        body: JSON.stringify({
          profile: draft,
          revision: saved.revision,
          ...(saved.username ? { username: saved.username } : {}),
        }),
        headers: { "Content-Type": "application/json" },
        method: "PUT",
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Could not save your draft.");
      setSaved(result);
      setDraft(result.profile);
      setStatus("Saved privately. Publish from the editor to update your public website and CV.");
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Could not save.");
    } finally {
      setSaving(false);
    }
  }
  return (
    <AiAssistantEditor
      chat={{
        actions: (
          <Button disabled={!dirty || saving} onClick={save} variant="outline">
            {saving ? "Saving…" : "Save draft"}
          </Button>
        ),
        editorHref: saved.username ? editCvPath(saved.username) : "/admin",
        error,
        status,
      }}
      managed={false}
      onChange={setDraft}
      profile={draft}
      profileId={saved.id}
      revision={saved.revision}
    />
  );
}
