import { DownloadCVButton } from '../../../ui/buttons/DownloadCVButton'

export const CVSection: React.FC = () => {
  return (
    <section className="w-full bg-main-light" id="cv">
      <div className="max-w-6xl mx-auto text-center">
        <DownloadCVButton />
      </div>
    </section>
  )
}
