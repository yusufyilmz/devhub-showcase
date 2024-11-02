import { CompanyItem } from '../CompanyItem/CompanyItem'
import { CompanyWithProjects } from '@shared/lib/types'
import { ScrollableContainer } from '../../../ui/ScrollableContainer/ScrollableContainer'

interface CompanyListProps {
  companies: CompanyWithProjects[]
}

export const CompanyList: React.FC<CompanyListProps> = ({ companies }) => {
  return (
    <ScrollableContainer category="experience">
      {companies.map(company => (
        <div
          className="py-2 w-full sm:w-1/2 md:w-1/3 lg:w-1/4"
          key={company.id}
        >
          <CompanyItem company={company} />
        </div>
      ))}
    </ScrollableContainer>
  )
}
