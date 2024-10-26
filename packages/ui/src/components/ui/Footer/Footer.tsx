import { copy } from '@shared/content'

export const Footer: React.FC = () => {
  return (
    <footer className="bg-main-primary text-main-white min-h-10 py-6 z-50 sticky">
      <div className="max-w-6xl mx-auto text-center">
        <p className="text-sm text-main-gray">{copy.footer.copyright}</p>
      </div>
    </footer>
  )
}
