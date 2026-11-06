"use client";

import { useState } from "react";

import { urls } from "@shared/config/urls";
import type { ProfileSnapshot } from "@shared/services/profile";

import { ProfileEditor } from "../profile-editor";
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
        saveUrl={urls.studio.managedPortfolio(id)}
      />
      <div className="studio [--studio-top:0px]">
        <TransferPortfolio id={id} onTransferred={onTransferred} revision={revision} />
      </div>
    </>
  );
}
