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
      <div className="studio [--studio-bottom:0px]">
        <a className="text-[rgb(var(--accent-rgb))]" href="/admin/portfolios">
          ← Managed portfolios
        </a>
        <p className="leading-[1.7] wrap-anywhere text-[rgb(var(--muted-rgb))]">
          Temporary managed portfolio. You control publishing. Review placeholder contact details
          before sharing it.
        </p>
      </div>
      <ManagedWorkspace id={id} initial={snapshot} />
    </>
  );
}
