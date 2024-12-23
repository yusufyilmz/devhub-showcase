import { Logger } from 'pino'
import { PageResources } from '../../types/resources'
import { EducationService } from '../education'
import { ExperienceService } from '../experience'
import { ProjectService } from '../project'
import { ReferralService } from '../referral'
import { SkillService } from '../skill'

export class ResourceManager {
  constructor(
    private logger: Logger,
    private readonly experienceService = new ExperienceService(),
    private readonly projectService = new ProjectService(),
    private readonly educationService = new EducationService(),
    private readonly referralService = new ReferralService(this.logger),
    private readonly skillService = new SkillService()
  ) {}

  async getAllResources(): Promise<PageResources> {
    const projects = await this.projectService.getAllProjectsWithCompanies()
    const experiences =
      await this.experienceService.getAllExperiencesWithCompanyProjectAndSkills()
    const educations = await this.educationService.getAllEducations()
    const referrals = await this.referralService.getApprovedReferrals()
    const skills = await this.skillService.getCategorizedSkills()

    return {
      projects,
      experiences,
      educations,
      referrals,
      skills
    }
  }
}
