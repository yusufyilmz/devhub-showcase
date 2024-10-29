import Chip from '@mui/material/Chip'

export const SkillItem: React.FC<{ name: string; experienceYear?: string }> = ({
  name,
  experienceYear
}) => {
  return (
    <Chip
      label={`${name}${experienceYear ? ` (${experienceYear})` : ''}`}
      className="bg-main-light text-main-blue rounded-full px-3 py-1 border chip-shine-effect"
    />
  )
}
