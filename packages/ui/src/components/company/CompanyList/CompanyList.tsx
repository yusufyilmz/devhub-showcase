import { Grid } from '@mui/material'
import { Company } from '@prisma/client'
import { CompanyItem } from '../CompanyItem/CompanyItem'

interface CompanyListProps {
  companies: (Company & { projects?: { id: string; title: string }[] })[]
}

export const CompanyList: React.FC<CompanyListProps> = ({ companies }) => {
  return (
    <Grid container spacing={3} className="company-section">
      {companies.map(company => (
        <CompanyItem
          key={company.id}
          company={company}
          projects={company.projects}
        />
      ))}
    </Grid>
  )
}
