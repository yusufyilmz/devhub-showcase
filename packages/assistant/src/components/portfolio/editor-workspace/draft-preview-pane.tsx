"use client";

import { useState } from "react";

import {
  formatPortfolioPeriod,
  getPortfolioCopy,
  type PortfolioProfile,
  projectPublicProfile,
} from "@shared/config";
import { Button } from "@shared/ui/button";

import type { DraftPreviewPaneProps } from "./types";

export function DraftPreviewPane({
  profile,
  downloadHref,
  children,
  showSavedDownload = true,
}: DraftPreviewPaneProps) {
  const [output, setOutput] = useState<"website" | "cv">("website");
  return (
    <>
      <div className="editor-preview-heading [display:flex] [gap:12px] [align-items:center] [justify-content:space-between] [margin-bottom:16px] [&_h2]:[font-size:18px] [font-weight:600] [&_p]:[font-size:11px] [color:var(--muted-foreground)]">
        <h2>Draft preview</h2>
        <p>Private · not published</p>
      </div>
      <fieldset
        aria-label="Preview output"
        className="editor-preview-outputs [display:flex] [gap:8px] [margin-bottom:16px] [&_[aria-pressed='true']]:[color:var(--primary)]"
      >
        <Button
          aria-pressed={output === "website"}
          onClick={() => setOutput("website")}
          type="button"
          variant="outline"
        >
          Website
        </Button>
        <Button
          aria-pressed={output === "cv"}
          onClick={() => setOutput("cv")}
          type="button"
          variant="outline"
        >
          CV
        </Button>
      </fieldset>
      <div hidden={output !== "website"}>{children}</div>
      {output === "cv" && (
        <>
          <p className="editor-preview-note [margin-bottom:16px] [font-size:12px] [line-height:1.6] [color:var(--muted-foreground)]">
            CV content preview, including unsaved edits.
            {showSavedDownload &&
              " Download the saved PDF to check pagination and your selected PDF layout."}
          </p>
          <CvContentPreview profile={profile} />
          {showSavedDownload && (
            <Button href={downloadHref} variant="outline">
              Download saved PDF
            </Button>
          )}
        </>
      )}
    </>
  );
}

function CvContentPreview({ profile }: { profile: PortfolioProfile }) {
  const cv = projectPublicProfile(profile, "cv");
  const copy = getPortfolioCopy(profile.cvLanguage);
  return (
    <article
      aria-label="CV content preview"
      className="editor-cv-content [padding:24px] [background:var(--card)] [border:1px_solid_var(--border)] [border-radius:8px] [&_h3]:[margin-block:20px_12px] [font-size:14px] [font-weight:600] [&_h2]:[font-size:24px] [&_p]:[font-size:12px] [line-height:1.7] [overflow-wrap:anywhere] [&_li]:[font-size:12px] [&_article]:[margin-block:16px] [&_ul]:[padding-left:18px] [list-style:disc]"
    >
      <h2>{cv.name}</h2>
      <p>{cv.title}</p>
      <p>
        {[
          cv.location,
          profile.cvSettings?.showEmail !== false && cv.email,
          profile.cvSettings?.showPhone !== false && cv.phone,
        ]
          .filter(Boolean)
          .join(" · ")}
      </p>
      <p>{cv.summary}</p>
      {cv.experiences.length > 0 && <h3>{copy.experience}</h3>}
      {cv.experiences.map((item) => (
        <article key={item.id}>
          <strong>
            {item.company} · {item.position}
          </strong>
          <p>{formatPortfolioPeriod(item.start, item.end, profile.cvLanguage)}</p>
          <ul>
            {[...new Set(item.achievements)].map((achievement) => (
              <li key={achievement}>{achievement}</li>
            ))}
          </ul>
        </article>
      ))}
      {profile.cvSettings?.includeProjects !== false &&
        cv.projects
          .filter((item) => item.public)
          .map((item) => (
            <article key={item.id}>
              <strong>{item.name}</strong>
              <p>{item.description}</p>
              <p>{item.skills.join(", ")}</p>
            </article>
          ))}
      {cv.education.map((item) => (
        <article key={item.id}>
          <strong>{item.institution}</strong>
          <p>
            {item.degree} · {item.field}
          </p>
          <p>{formatPortfolioPeriod(item.start, item.end, profile.cvLanguage)}</p>
        </article>
      ))}
      {Object.entries(cv.skills).map(([group, skills]) => (
        <p key={group}>
          <strong>{group}</strong> · {skills.join(", ")}
        </p>
      ))}
      {profile.cvSettings?.includeLanguages !== false &&
        cv.languages.map((item) => (
          <p key={item.id}>
            {item.language} · {item.proficiency}
          </p>
        ))}
    </article>
  );
}
