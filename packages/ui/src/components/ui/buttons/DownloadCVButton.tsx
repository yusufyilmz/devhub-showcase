export const DownloadCVButton: React.FC = () => {
  return (
    <a
      href="/cv.pdf"
      download="Yusuf_Yilmaz_CV.pdf"
      className="w-full inline-block bg-button-primary text-white hover:bg-gray-800 px-6 py-3 rounded-lg shadow transition"
    >
      Download CV
    </a>
  )
}
