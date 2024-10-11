import { siteCopy } from '@shared/content'
import { DownloadCVButton } from '../../ui/buttons/DownloadCVButton'

export const CVSection: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto text-center">
      <h2 className="text-2xl font-bold text-main-black mb-6">
        {siteCopy.cvSection.title}
      </h2>
      <DownloadCVButton />
    </div>
  )
}
