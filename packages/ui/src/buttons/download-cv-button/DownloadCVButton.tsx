import { Download } from "lucide-react";

import { Button } from "../button";

export function DownloadCVButton() {
  return (
    <Button asChild className="h-auto min-h-10 w-full px-md py-xs text-center whitespace-normal">
      <a download="Yusuf_Yilmaz_CV.pdf" href="/cv.pdf">
        <Download aria-hidden="true" />
        Download CV
      </a>
    </Button>
  );
}
