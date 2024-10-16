import { ProjectWithCompanyAndSkills } from '../project'
import { ExperienceWithCompanyProjectAndSkills } from '../experience'
import { Education } from '../education'
import { Referral } from '../referral'

export type PageResources = {
  experiences: ExperienceWithCompanyProjectAndSkills[]
  projects: ProjectWithCompanyAndSkills[]
  educations: Education[]
  referrals: Referral[]
}
