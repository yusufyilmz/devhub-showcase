"use client";
import type { ProfileSnapshot } from "@shared/lib/profile-errors";
import { useState } from "react";
import { ProfileEditor } from "../admin/profile-editor";
import { TransferPortfolio } from "./transfer-portfolio";
export function ManagedWorkspace({
  initial,
  id,
}: {
  initial: ProfileSnapshot;
  id: string;
}) {
  const [revision, setRevision] = useState(initial.revision);
  return (
    <>
      <ProfileEditor
        initial={initial}
        saveUrl={`/api/admin/managed/${id}`}
        downloadHref={`/admin/portfolios/${id}/cv.pdf`}
        managed
        onSaved={(saved) => setRevision(saved.revision)}
      />
      <div className="studio managed-transfer">
        <TransferPortfolio id={id} revision={revision} />
      </div>
    </>
  );
}
