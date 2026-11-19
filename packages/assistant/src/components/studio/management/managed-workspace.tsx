"use client";

import { useRouter } from "next/navigation";
import { type ReactNode, useState } from "react";

import { urls } from "@shared/config/urls";
import type { ProfileSnapshot } from "@shared/lib/profile";

import { ProfileEditor } from "../workspace/index";
import type { PublishedPortfolioLayoutProps } from "../workspace/preview-content";
import { TransferPortfolio } from "./transfer-portfolio";

export function ManagedWorkspace({
  initial,
  id,
  renderPortfolio,
}: {
  initial: ProfileSnapshot;
  id: string;
  renderPortfolio?: (props: PublishedPortfolioLayoutProps) => ReactNode;
}) {
  const router = useRouter();

  const [revision, setRevision] = useState(initial.revision);

  const handleTransferred = () => {
    router.push("/studio/portfolios");
    router.refresh();
  };

  return (
    <>
      <ProfileEditor
        downloadHref={`/studio/portfolios/${id}/cv.pdf`}
        initial={initial}
        managed
        onSaved={(saved) => setRevision(saved.revision)}
        renderPortfolio={renderPortfolio}
        saveUrl={urls.studio.managedPortfolio(id)}
      />
      <div className="studio [max-width:1160px] [padding:var(--studio-top,_36px)_40px_var(--studio-bottom,_80px)] [margin:auto] max-[767px]:[padding:var(--studio-top,_20px)_18px_var(--studio-bottom,_50px)] [&.studio-editor]:[max-width:none] [padding:0_32px_96px_0] max-[767px]:[&.studio-editor]:[padding:20px_16px_104px] [--studio-bottom:0px]">
        <TransferPortfolio id={id} onTransferred={handleTransferred} revision={revision} />
      </div>
    </>
  );
}
