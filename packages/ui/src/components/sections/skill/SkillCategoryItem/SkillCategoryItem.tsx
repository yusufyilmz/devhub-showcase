import type { Skill } from '@shared/lib/types'
import { capitalizeFirstLetter } from '@shared/lib/utils'
import type React from 'react'
import { Card, CardBody, Divider, Typography } from '../../../../components'
import { SkillItem } from '../SkillItem/SkillItem'

export const SkillCategoryItem: React.FC<{ name: string; skills: Skill[] }> = ({
  name,
  skills
}) => {
  return (
    <Card className="section-card">
      <CardBody className="flex flex-col">
        <Typography
          variant="h3"
          className="text-left font-semibold text-main-white mb-3 text-2xl"
        >
          {capitalizeFirstLetter(name)}
        </Typography>
        <Divider className="bg-main-light-slate mb-6 mt-0" />
        <div className="flex justify-start flex-wrap gap-2">
          {skills.map((skill) =>
            skill?.name ? (
              <SkillItem
                key={skill.id}
                name={skill.name}
                experienceYear={skill.experienceYear ?? undefined}
              />
            ) : null
          )}
        </div>
      </CardBody>
    </Card>
  )
}
