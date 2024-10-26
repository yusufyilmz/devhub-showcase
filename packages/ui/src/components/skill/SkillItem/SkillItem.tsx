import Chip from '@mui/material/Chip'

export const SkillItem: React.FC<{ name: string }> = ({ name }) => {
  return (
    <Chip
      label={name}
      className="bg-main-light text-main-blue rounded-full px-3 py-1 border"
    />
  )
}
