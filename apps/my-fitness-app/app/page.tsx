import { configured } from "@/lib/auth";

import { FitnessApp } from "./fitness-app";
export const dynamic = "force-dynamic";
export default function Page() {
  if (!configured() || !process.env.SUPABASE_DB_URL || !process.env.WORKSPACE_OWNER_ID)
    return (
      <main className="login">
        <span className="brand">↗ Fitness OS</span>
        <h1>Your space is almost ready.</h1>
        <p>Connect your Supabase project and set the workspace owner using README.md.</p>
        <a className="primary" href="/login">
          Owner sign in
        </a>
      </main>
    );
  return <FitnessApp />;
}
