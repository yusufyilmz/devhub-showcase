export const PageHeader: React.FC<{ title: string; subtitle: string }> = ({
  title,
  subtitle
}): JSX.Element => (
  <div className="text-center mb-8">
    <h2 className="text-4xl font-bold mb-2">{title}</h2>
    <p className="text-lg text-gray-500 italic">{subtitle}</p>
  </div>
)
