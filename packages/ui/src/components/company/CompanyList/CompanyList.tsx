import { CompanyItem } from '../CompanyItem/CompanyItem'
import { CompanyWithProjects } from '@shared/lib/types'
import { ScrollableContainer } from '../../ui/ScrollableContainer/ScrollableContainer'
import { Grid } from '@mui/material'

interface CompanyListProps {
  companies: CompanyWithProjects[]
}

export const CompanyList: React.FC<CompanyListProps> = ({ companies }) => {
  return (
    <ScrollableContainer>
      {companies.map(company => (
        <Grid
          sx={{ py: 2 }}
          key={company.id}
          item
          xs={12}
          sm={6}
          md={4}
          lg={3}
          alignItems={'stretch'}
        >
          <CompanyItem company={company} />
        </Grid>
      ))}
    </ScrollableContainer>
  )
}
