import { Box } from '@mui/material'

export const PageHeader: React.FC<{ title: string; subtitle: string }> = ({
  title,
  subtitle
}): JSX.Element => (
  <div className="z-50 sticky top-0 bg-main-primary w-full text-center ">
    <Box className="flex items-center flex-col text-textColor-light justify-center text-center">
      <h2 className="text-4xl font-bold mb-2">{title}</h2>
      <p className="text-lg text-textColor-lightSlate italic">{subtitle}</p>
    </Box>
  </div>
)
