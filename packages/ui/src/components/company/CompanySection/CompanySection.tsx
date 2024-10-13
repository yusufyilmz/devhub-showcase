import { Company } from '@prisma/client'
import { CompanyList } from '../CompanyList'

interface CompanySectionProps {
  companies: Company[]
}

export const CompanySection: React.FC<CompanySectionProps> = ({
  companies
}) => {
  return (
    <section className="w-full" id="companies">
      <div className="text-center">
        <h2 className="text-4xl font-bold mb-12">My Companies</h2>
        <CompanyList companies={companies} />
      </div>
    </section>
  )
}
