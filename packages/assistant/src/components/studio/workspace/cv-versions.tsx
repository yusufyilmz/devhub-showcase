"use client";
import { useCallback } from "react";

import type { PortfolioProfile } from "@shared/config";
import { urls } from "@shared/config/urls";
import { cvLibrarySchema } from "@shared/lib/profiles";
import { useStudioRequest } from "@shared/runtime/studio";

import { CvVersionsEditor } from "../../portfolio/index";

type Library = { variants: ReturnType<typeof cvLibrarySchema.parse>; revision: number };
const downloadHref = (id: string) => `${urls.studio.cvVariants()}/${encodeURIComponent(id)}/pdf`;
export function PrivateCvVersions({
  profile,
  sourceRevision,
}: {
  profile: PortfolioProfile;
  sourceRevision: number;
}) {
  const request = useStudioRequest();
  const load = useCallback(async (): Promise<Library> => {
    const response = await request(urls.studio.cvVariants());
    const data = await response.json();
    if (!response.ok) throw new Error(data.error);
    return { revision: data.revision, variants: cvLibrarySchema.parse(data.variants) };
  }, [request]);
  const save = useCallback(
    async (library: Library): Promise<Library> => {
      const response = await request(urls.studio.cvVariants(), {
        body: JSON.stringify(library),
        headers: { "Content-Type": "application/json" },
        method: "PUT",
      });
      const data = await response.json();
      if (!response.ok)
        throw new Error(data.error ?? "Could not save CV versions. Your local changes remain.");
      return { revision: data.revision, variants: cvLibrarySchema.parse(data.variants) };
    },
    [request],
  );
  const requestInterviewPrep = useCallback<
    NonNullable<React.ComponentProps<typeof CvVersionsEditor>["requestInterviewPrep"]>
  >(
    async (input, signal) => {
      const response = await request(urls.studio.interviewPrep(), {
        body: JSON.stringify({ ...input, requestId: crypto.randomUUID() }),
        headers: { "Content-Type": "application/json" },
        method: "POST",
        signal,
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Interview prep is unavailable.");
      return data;
    },
    [request],
  );
  return (
    <CvVersionsEditor
      downloadHref={downloadHref}
      load={load}
      profile={profile}
      requestInterviewPrep={requestInterviewPrep}
      save={save}
      sourceRevision={sourceRevision}
    />
  );
}
