import type React from "react";

export const DownloadCVButton: React.FC = () => {
  return (
    <a
      className="w-full inline-block bg-button-primary text-white hover:bg-gray-800 px-6 py-3 rounded-lg shadow-sm transition"
      download="Yusuf_Yilmaz_CV.pdf"
      href="/cv.pdf"
    >
      Download CV
    </a>
  );
};
