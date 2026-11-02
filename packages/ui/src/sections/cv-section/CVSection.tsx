import type React from "react";

import { DownloadCVButton } from "../../buttons/buttons";
import { cVSectionStyles } from "./styles";

export const CVSection: React.FC = () => {
  return (
    <section className={cVSectionStyles.element1} id="cv">
      <div className={cVSectionStyles.element2}>
        <DownloadCVButton />
      </div>
    </section>
  );
};
