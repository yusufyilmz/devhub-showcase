import { Card, CardContent, Divider, Typography } from '@mui/material'
import { Skill } from '@shared/lib/types'
import { SkillItem } from '../SkillItem/SkillItem'
import { capitalizeFirstLetter } from '@shared/lib/utils'

export const SkillCategoryItem: React.FC<{ name: string; skills: Skill[] }> = ({
  name,
  skills
}) => {
  return (
    <Card className="section-card">
      <CardContent className="flex flex-col">
        <Typography
          variant="h5"
          align="left"
          className="font-semibold text-main-white mb-3 text-2xl"
        >
          {capitalizeFirstLetter(name)}
        </Typography>
        <Divider className="bg-main-light-slate mb-6 mt-0" />
        <div className="flex flex-wrap gap-2">
          {skills.map((skill, index) =>
            skill?.name ? <SkillItem key={index} name={skill.name} /> : null
          )}
        </div>
      </CardContent>
    </Card>
  )
}
