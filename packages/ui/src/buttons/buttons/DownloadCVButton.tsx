import type React from "react";

import { downloadCVButtonStyles } from "./styles";

export const DownloadCVButton: React.FC = () => {
  return (
    <a className={downloadCVButtonStyles.element1} download="Yusuf_Yilmaz_CV.pdf" href="/cv.pdf">
      Download CV
    </a>
  );
};
