import { PageHeader } from '../../ui/PageHeader'
import { CompanyList } from '../CompanyList'
import { CompanyWithProjects } from '@shared/lib/types'

interface CompanySectionProps {
  companies: CompanyWithProjects[]
}

export const CompanySection: React.FC<CompanySectionProps> = ({
  companies
}) => {
  return (
    <section className="w-full px-page-px-sm" id="companies">
      <div className="text-center">
        <PageHeader
          title="Professional Experience"
          subtitle="Roles and Companies I've Worked With"
        />
        <CompanyList companies={companies} />
      </div>
    </section>
  )
}
