import { notFound } from "next/navigation";

import { managedRepository } from "@/features/management/managed-portfolios";
import { ManagedWorkspace } from "@/features/management/managed-workspace";

export default async function ManagedEditor({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const admin = await managedRepository(id).catch(() => null);
  if (!admin) notFound();
  const snapshot = await admin.repository.read();
  if (!snapshot) notFound();
  return (
    <>
      <div className="studio [max-width:1160px] [padding:var(--studio-top,_36px)_40px_var(--studio-bottom,_80px)] [margin:auto] max-[767px]:[padding:var(--studio-top,_20px)_18px_var(--studio-bottom,_50px)] [&.studio-editor]:[max-width:none] [padding:0_32px_96px_0] max-[767px]:[&.studio-editor]:[padding:20px_16px_104px] [--studio-bottom:0px]">
        <a className="text-[var(--primary)]" href="/admin/portfolios">
          ← Managed portfolios
        </a>
        <p className="leading-[1.7] wrap-anywhere text-[var(--muted-foreground)]">
          Temporary managed portfolio. You control publishing. Review placeholder contact details
          before sharing it.
        </p>
      </div>
      <ManagedWorkspace id={id} initial={snapshot} />
    </>
  );
}
