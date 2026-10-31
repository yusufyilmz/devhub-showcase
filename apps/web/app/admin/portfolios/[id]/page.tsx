import { notFound } from "next/navigation";

import { ManagedWorkspace } from "@/features/management/managed-workspace";
import { managedRepository } from "@/lib/managed-portfolios";
import "@/features/management/management.css";
export default async function ManagedEditor({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const admin = await managedRepository(id).catch(() => null);
  if (!admin) notFound();
  const snapshot = await admin.repository.read();
  if (!snapshot) notFound();
  return (
    <>
      <div className="studio managed-notice">
        <a href="/admin/portfolios">← Managed portfolios</a>
        <p>
          Temporary managed portfolio. You control publishing. Review placeholder contact details
          before sharing it.
        </p>
      </div>
      <ManagedWorkspace id={id} initial={snapshot} />
    </>
  );
}
