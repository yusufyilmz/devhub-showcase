import { Alert, AlertDescription, AlertTitle } from "@shared/ui/alert";
import { Button } from "@shared/ui/button";

import { env } from "@/env";
import { configured } from "@/lib/auth";

import { FitnessApp } from "../features/fitness/fitness-app";

export const dynamic = "force-dynamic";

export default async function Page() {
  if (!configured() || !env.SUPABASE_DB_URL)
    return (
      <main className="fitness-state [display:grid] [gap:18px] [justify-items:start] [width:min(100%_-_32px,_32rem)] [margin:clamp(2rem,_12vh,_8rem)_auto_0] [&_>_*]:[width:100%]">
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
