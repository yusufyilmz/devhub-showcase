import { copy } from '@shared/content'
import type { Skill } from '@shared/lib/types'
import type React from 'react'
import { List, ListItem, Section } from '../../../../components'
import { SkillCategoryItem } from '../SkillCategoryItem'

const { skills: skillProps } = copy.header.sections

export const SkillSection: React.FC<{ skills: Record<string, Skill[]> }> = ({
  skills = []
}) => {
  return (
    <Section
      className="mt-8"
      sectionId={skillProps.id}
      title={skillProps.title}
      subtitle={skillProps.subtitle}
    >
      <div className="flex h-full">
        <List className="overflow-y-auto mt-2 no-scrollbar w-full mb-10">
          {Object.entries(skills).map(([category, skills]) => (
            <ListItem key={category} className="pl-0 md:pl-4 py-4">
              <SkillCategoryItem name={category} skills={skills} />
            </ListItem>
          ))}
        </List>
      </div>
    </Section>
  )
}
