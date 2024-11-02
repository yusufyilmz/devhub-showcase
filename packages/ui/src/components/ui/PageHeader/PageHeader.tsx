export const PageHeader: React.FC<{ title: string; subtitle: string }> = ({
  title,
  subtitle
}): JSX.Element => (
  <div className="z-50 sticky top-0 w-full text-center">
    <div className="flex items-center flex-col text-textColor-light justify-center text-center mx-8">
      <h2 className="text-4xl font-bold mb-2">{title}</h2>
      <p className="text-lg text-textColor-lightSlate italic">{subtitle}</p>
    </div>
  </div>
)
