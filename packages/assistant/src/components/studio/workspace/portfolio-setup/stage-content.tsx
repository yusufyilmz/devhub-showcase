import type { ReactNode } from "react";

import { type PortfolioProfile, type PortfolioType, portfolioTypes } from "@shared/config";
import { Button } from "@shared/ui/button";
import { SelectField } from "@shared/ui/forms";

import { PortfolioTypePicker } from "../../../portfolio/portfolio-type-picker";
import { CustomSectionsEditor } from "../../../sections/studio/custom-sections-editor";
import { CvImportEditor } from "../../import/cv-import-editor";
import { SetupProfile } from "./profile";
import { type SetupPosition, sections } from "./steps";

export function SetupStageContent({
  assistant,
  busy,
  go,
  onApplyCv,
  onChange,
  onProfession,
  position,
  preview,
  profession,
  profile,
}: {
  assistant?: ReactNode;
  busy: boolean;
  go: (stage: number, section?: number) => void;
  onApplyCv: (profile: PortfolioProfile) => void;
  onChange: (profile: PortfolioProfile) => void;
  onProfession: (profession: PortfolioType) => void;
  position: SetupPosition;
  preview: ReactNode;
  profession: PortfolioType;
  profile: PortfolioProfile;
}) {
  const { stage, section } = position;
  const activeSection = sections[section] ?? sections[0];
  const Editor = activeSection.Editor;

  return (
    <fieldset className="portfolio-setup-content" disabled={busy}>
      {stage === 0 && (
        <SelectField
          label="What kind of work do you do?"
          onChange={(value) => onProfession(value as PortfolioType)}
          value={profession}
        >
          {portfolioTypes.map((type) => (
            <option key={type.id} value={type.id}>
              {type.id === "minimal" ? "General portfolio" : type.audience}
            </option>
          ))}
        </SelectField>
      )}
      {stage === 1 && (
        <PortfolioTypePicker
          onChange={(portfolioType) => onChange({ ...profile, portfolioType })}
          value={profile.portfolioType ?? profession}
        />
      )}
      {stage === 2 && <CvImportEditor embedded onChange={onApplyCv} profile={profile} />}
      {stage === 3 &&
        (section === sections.length - 1 ? (
          <CustomSectionsEditor focused onChange={onChange} profile={profile} />
        ) : Editor ? (
          <Editor key={activeSection.title} onChange={onChange} profile={profile} />
        ) : (
          <SetupProfile assistant={assistant} onChange={onChange} profile={profile} />
        ))}
      {stage === 4 && (
        <>
          <nav aria-label="Edit draft sections" className="portfolio-setup-review-links">
            {sections.map(({ title }, index) => (
              <Button key={title} onClick={() => go(3, index)} type="button" variant="outline">
                {title}
              </Button>
            ))}
          </nav>
          <div className="editor-preview-pane">{preview}</div>
        </>
      )}
    </fieldset>
  );
}
