import { requireConfirmedUser } from "@shared/auth";
import { createServerClient } from "@shared/lib/supabase";
import { redirect } from "next/navigation";

import { ChatSettings } from "./chat-settings";
import { BillingControls } from "./controls";

export default async function BillingPage() {
  try {
    await requireConfirmedUser(await createServerClient());
  } catch {
    redirect("/admin/login");
  }
  return (
    <main className="studio-shell">
      <section className="editor-card">
        <h1>Subscription settings</h1>
        <p>
          Stripe test environment. No live payments are enabled. Premium AI features are being
          prepared and are not available yet.
        </p>
        <p>
          Checkout displays the configured monthly test price. AI allowances count reserved
          attempts, including failed or uncertain provider requests.
        </p>
        <BillingControls />
        <ChatSettings />
        <a href="/admin">Back to your portfolio</a>
      </section>
    </main>
  );
}
