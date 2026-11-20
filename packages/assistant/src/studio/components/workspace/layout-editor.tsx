"use client";

import type { PortfolioProfile } from "@shared/config";
import { Card } from "@shared/ui/cards";

import { PortfolioTypePicker } from "../../../portfolio/components/portfolio-type-picker";
import { TemplatePicker } from "../../../portfolio/components/template-picker";

export function LayoutEditor({
  profile,
  onChange,
}: {
  profile: PortfolioProfile;
  onChange: (profile: PortfolioProfile) => void;
}) {
  return (
    <Card asChild layout="plain" surface="portfolio">
      <section className="editor-card mb-[18px] rounded-[14px] border border-border bg-card p-7 max-[767px]:p-[18px]">
        <PortfolioTypePicker
          onChange={(portfolioType) => onChange({ ...profile, portfolioType })}
          value={profile.portfolioType ?? "engineer"}
        />
        <TemplatePicker onChange={onChange} profile={profile} />
        <p>Your CV layout is chosen separately in the PDF section.</p>
      </section>
    </Card>
  );
}
