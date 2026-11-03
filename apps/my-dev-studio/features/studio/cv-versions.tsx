"use client";
import { useCallback } from "react";

import type { PortfolioProfile } from "@shared/config";
import { urls } from "@shared/config/urls";
import { cvLibrarySchema } from "@shared/lib/profiles";
import { useStudioRequest } from "@shared/runtime/studio";
import { CvVersionsEditor } from "@shared/ui/portfolio";

type Library = { variants: ReturnType<typeof cvLibrarySchema.parse>; revision: number };
const downloadHref = (id: string) =>
  `${urls.next.studio.cvVariants()}/${encodeURIComponent(id)}/pdf`;
export function PrivateCvVersions({
  profile,
  sourceRevision,
}: {
  profile: PortfolioProfile;
  sourceRevision: number;
}) {
  const request = useStudioRequest();
  const load = useCallback(async (): Promise<Library> => {
    const response = await request(urls.next.studio.cvVariants());
    const data = await response.json();
    if (!response.ok) throw new Error(data.error);
    return { revision: data.revision, variants: cvLibrarySchema.parse(data.variants) };
  }, [request]);
  const save = useCallback(
    async (library: Library): Promise<Library> => {
      const response = await request(urls.next.studio.cvVariants(), {
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
  return (
    <CvVersionsEditor
      downloadHref={downloadHref}
      load={load}
      profile={profile}
      save={save}
      sourceRevision={sourceRevision}
    />
  );
}
