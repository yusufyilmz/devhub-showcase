import { copy } from '@shared/content'

export const Footer: React.FC = () => {
  return (
    <footer className="bg-main-black text-main-white py-6">
      <div className="max-w-6xl mx-auto text-center">
        <p className="text-sm text-main-gray">{copy.footer.copyright}</p>
      </div>
    </footer>
  )
}
