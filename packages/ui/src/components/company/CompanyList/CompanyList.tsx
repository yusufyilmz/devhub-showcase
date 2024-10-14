import { CompanyItem } from '../CompanyItem/CompanyItem'
import { CompanyWithProjects } from '@shared/lib'
import { ScrollableContainer } from '../../ui/ScrollableContainer/ScrollableContainer'

interface CompanyListProps {
  companies: CompanyWithProjects[]
}

export const CompanyList: React.FC<CompanyListProps> = ({ companies }) => {
  return (
    <ScrollableContainer>
      {companies.map(company => (
        <CompanyItem
          key={company.id}
          company={company}
          projects={company.projects}
        />
      ))}
    </ScrollableContainer>
  )
}
