import { Alert, AlertDescription, AlertTitle } from "@shared/ui/alert";
import { Button } from "@shared/ui/button";

import { configured } from "@/lib/auth";

import { FitnessApp } from "../features/fitness/fitness-app";

export const dynamic = "force-dynamic";

export default async function Page() {
  if (!configured() || !process.env.SUPABASE_DB_URL)
    return (
      <main className="fitness-state">
        <Alert>
          <AlertTitle>My Fitness Studio setup is incomplete</AlertTitle>
          <AlertDescription>
            The demo is available while the workspace is being set up.
          </AlertDescription>
        </Alert>
        <Button href="/preview" variant="outline">
          Explore the demo
        </Button>
      </main>
    );
  return <FitnessApp />;
}
