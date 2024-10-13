import { Card, CardContent, Typography } from '@mui/material'
import { Company } from '@prisma/client'

type CompanyProps = {
  company: Company
  projects?: { id: string; title: string }[]
}

export const CompanyItem: React.FC<CompanyProps> = ({
  company,
  projects = []
}) => {
  return (
    <Card className="company-card p-4 border rounded-lg">
      <a href={company.url} target="_blank" rel="noopener noreferrer">
        <CardContent>
          <Typography
            variant="h6"
            component="h3"
            className="text-xl font-semibold"
          >
            {company.name}
          </Typography>
        </CardContent>
      </a>
      <CardContent>
        <ul className="mt-2">
          {projects?.map(project => <li key={project.id}>{project.title}</li>)}
        </ul>
      </CardContent>
    </Card>
  )
}
