import { Company } from '@prisma/client'

interface CompanyListProps {
  companies: (Company & { projects: { id: string; title: string }[] })[]
}

export const CompanyList: React.FC<CompanyListProps> = ({ companies }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {companies.map(company => (
        <div key={company.id} className="company-card p-4 border rounded-lg">
          <a href={company.url} target="_blank" rel="noopener noreferrer">
            <h3 className="text-xl font-semibold">{company.name}</h3>
          </a>
          <ul className="mt-2">
            {company.projects.map(project => (
              <li key={project.id}>{project.title}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}
