import { type ReactNode, useState } from "react";

import { Bot } from "lucide-react";

import type { PortfolioProfile } from "@shared/config";
import { Button } from "@shared/ui/button";
import { Field } from "@shared/ui/forms";

export function SetupProfile({
  profile,
  onChange,
  assistant,
}: {
  profile: PortfolioProfile;
  onChange: (profile: PortfolioProfile) => void;
  assistant?: ReactNode;
}) {
  const [showAssistant, setShowAssistant] = useState(false);
  return (
    <div className="grid gap-4">
      <Field
        label="Full name"
        onChange={(name) => onChange({ ...profile, name })}
        required
        value={profile.name === "Your name" ? "" : profile.name}
      />
      <Field
        label="Professional title"
        onChange={(title) => onChange({ ...profile, title })}
        required
        value={profile.title === "Add your professional title" ? "" : profile.title}
      />
      <Field
        label="Short introduction (optional)"
        multiline
        onChange={(summary) => onChange({ ...profile, summary })}
        value={profile.summary === "Add a short professional summary." ? "" : profile.summary}
      />
      <aside
        aria-label="Studio companion"
        className="flex flex-wrap items-center gap-2 rounded-md border border-border bg-secondary p-4 [&_p]:text-muted-foreground [&_svg]:text-primary [&>div]:flex-[1_1_12rem]"
      >
        <Bot aria-hidden="true" size={22} />
        <div>
          <strong>Studio companion</strong>
          <p>Start with what you do and the kind of work you want to share.</p>
        </div>
        {assistant && (
          <Button
            aria-expanded={showAssistant}
            onClick={() => setShowAssistant(!showAssistant)}
            type="button"
            variant="outline"
          >
            {showAssistant ? "Hide AI help" : "Help me write an introduction"}
          </Button>
        )}
      </aside>
      {showAssistant && assistant}
    </div>
  );
}
