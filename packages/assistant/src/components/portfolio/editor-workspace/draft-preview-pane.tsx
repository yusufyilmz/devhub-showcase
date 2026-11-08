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

export function DraftPreviewPane({ profile, downloadHref, children }: DraftPreviewPaneProps) {
  const [output, setOutput] = useState<"website" | "cv">("website");
  return (
    <>
      <div className="editor-preview-heading">
        <h2>Draft preview</h2>
        <p>Private · not published</p>
      </div>
      <fieldset aria-label="Preview output" className="editor-preview-outputs">
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
          <p className="editor-preview-note">
            CV content preview, including unsaved edits. Download the saved PDF to check pagination
            and your selected PDF layout.
          </p>
          <CvContentPreview profile={profile} />
          <Button href={downloadHref} variant="outline">
            Download saved PDF
          </Button>
        </>
      )}
    </>
  );
}

function CvContentPreview({ profile }: { profile: PortfolioProfile }) {
  const cv = projectPublicProfile(profile, "cv");
  const copy = getPortfolioCopy(profile.cvLanguage);
  return (
    <article aria-label="CV content preview" className="editor-cv-content">
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
