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
    <Card className="bg-backgroundColor-card rounded-xl shadow-xl overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-2xl company-card p-6 border mb-6 min-w-[20vw] ">
      <a
        href={company.url}
        target="_blank"
        rel="noopener noreferrer"
        className="hover:underline"
      >
        <CardContent>
          <h3 className="text-2xl font-bold text-textColor-primary">
            {company.name}
          </h3>
        </CardContent>
      </a>
      <CardContent>
        <h4 className="text-lg font-semibold text-textColor-secondary">
          {company.role}
        </h4>
        <p className="text-xs font-light text-textColor-secondary mt-2">
          {new Date(company.startedAt).toLocaleDateString()} -{' '}
          {company.finishedAt
            ? new Date(company.finishedAt).toLocaleDateString()
            : 'Present'}
        </p>

        <div className="mt-4">
          {projects.length > 0 ? (
            <ul className="project-list mt-4 space-y-2">
              {projects.map(project => (
                <li key={project.id}>
                  <a href="#" className="text-blue-500 hover:underline">
                    {project.title}
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <Typography variant="body2" className="text-gray-500">
              No projects available.
            </Typography>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
