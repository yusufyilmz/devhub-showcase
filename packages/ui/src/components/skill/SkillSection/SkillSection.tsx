import { copy } from '@shared/content'
import { Section } from '../../ui/Section'
import { SkillCategoryItem } from '../SkillCategoryItem'
import { Skill } from '@shared/lib/types'
import { Box, List, ListItem } from '@mui/material'

const { skills: skillProps } = copy.header.sections

export const SkillSection: React.FC<{ skills: Record<string, Skill[]> }> = ({
  skills
}) => {
  return (
    <Section
      className="py-8"
      sectionId={skillProps.id}
      title={skillProps.title}
      subtitle={skillProps.subtitle}
    >
      <Box className="flex h-full pl-40">
        <List className="overflow-y-auto top-16 no-scrollbar w-full">
          {Object.entries(skills).map(([category, skills]) => (
            <ListItem key={category} className='mb-8'>
              <SkillCategoryItem name={category} skills={skills} />
            </ListItem>
          ))}
        </List>
      </Box>
    </Section>
  )
}
