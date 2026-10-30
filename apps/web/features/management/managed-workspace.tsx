"use client";
import { useState } from "react";

import type { ProfileSnapshot } from "@shared/lib/profile-errors";

import { ProfileEditor } from "../admin/profile-editor";
import { TransferPortfolio } from "./transfer-portfolio";
export function ManagedWorkspace({ initial, id }: { initial: ProfileSnapshot; id: string }) {
  const [revision, setRevision] = useState(initial.revision);
  return (
    <>
      <ProfileEditor
        downloadHref={`/admin/portfolios/${id}/cv.pdf`}
        initial={initial}
        managed
        onSaved={(saved) => setRevision(saved.revision)}
        saveUrl={`/api/admin/managed/${id}`}
      />
      <div className="studio managed-transfer">
        <TransferPortfolio id={id} revision={revision} />
      </div>
    </>
  );
}
