import { ExperienceItem } from '../ExperienceItem/ExperienceItem'
import { ExperienceWithCompanyProjectAndSkills } from '@shared/lib/types'
import { ScrollableContainer } from '../../ui/ScrollableContainer/ScrollableContainer'
import { Grid } from '@mui/material'

interface ExperienceListProps {
  experiences: ExperienceWithCompanyProjectAndSkills[]
}

export const ExperienceList: React.FC<ExperienceListProps> = ({
  experiences
}) => {
  return (
    <ScrollableContainer>
      {experiences.map(experience => (
        <Grid
          sx={{ py: 2 }}
          key={experience.id}
          item
          xs={12}
          sm={6}
          md={4}
          lg={3}
        >
          <ExperienceItem experience={experience} />
        </Grid>
      ))}
    </ScrollableContainer>
  )
}
