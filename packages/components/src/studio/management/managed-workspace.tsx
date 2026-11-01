"use client";

import "./management.css";

import { useState } from "react";

import type { ProfileSnapshot } from "@shared/lib/profile-errors";

import { ProfileEditor } from "../admin/admin-profile-editor";
import { TransferPortfolio } from "./transfer-portfolio";

export function ManagedWorkspace({
  initial,
  id,
  onTransferred,
}: {
  initial: ProfileSnapshot;
  id: string;
  onTransferred: () => void;
}) {
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
        <TransferPortfolio id={id} onTransferred={onTransferred} revision={revision} />
      </div>
    </>
  );
}
