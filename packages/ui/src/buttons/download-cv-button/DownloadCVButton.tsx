import { Button } from "../button";

export function DownloadCVButton() {
  return (
    <Button asChild className="h-auto w-full px-5 py-2.5">
      <a download="Yusuf_Yilmaz_CV.pdf" href="/cv.pdf">
        Download CV
      </a>
    </Button>
  );
}
