import type { ReactNode } from "react";

import type { PortfolioProfile, PortfolioType } from "@shared/config";
import { Button } from "@shared/ui/button";

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
    <fieldset className="m-0 grid min-w-0 gap-4 border-0 p-0" disabled={busy}>
      {stage === 0 && (
        <PortfolioTypePicker
          className="my-0"
          description="This sets your starting layout. You can change it later in the editor."
          legend="What kind of work do you do?"
          onChange={onProfession}
          value={profile.portfolioType ?? profession}
        />
      )}
      {stage === 1 && <CvImportEditor embedded onChange={onApplyCv} profile={profile} />}
      {stage === 2 &&
        (section === sections.length - 1 ? (
          <CustomSectionsEditor focused onChange={onChange} profile={profile} />
        ) : Editor ? (
          <Editor key={activeSection.title} onChange={onChange} profile={profile} />
        ) : (
          <SetupProfile assistant={assistant} onChange={onChange} profile={profile} />
        ))}
      {stage === 3 && (
        <>
          <nav aria-label="Edit draft sections" className="flex flex-wrap items-center gap-2">
            {sections.map(({ title }, index) => (
              <Button key={title} onClick={() => go(2, index)} type="button" variant="outline">
                {title}
              </Button>
            ))}
          </nav>
          <div className="editor-preview-pane [min-width:0] [padding:24px] [background:var(--secondary)] [&_.draft-preview]:[padding:0] [margin:0] [background:transparent] [border:0] [&_.draft-preview_iframe]:[height:65dvh] max-[767px]:[padding:20px_16px]">
            {preview}
          </div>
        </>
      )}
    </fieldset>
  );
}
