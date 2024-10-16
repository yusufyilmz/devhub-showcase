import { Logger } from 'pino'
import { PageResources } from '../../types/resources'
import { EducationService } from '../education'
import { ExperienceService } from '../experience'
import { ProjectService } from '../project'
import { ReferralService } from '../referral'

export class ResourceManager {
  constructor(
    private logger: Logger,
    private readonly experienceService = new ExperienceService(),
    private readonly projectService = new ProjectService(),
    private readonly educationService = new EducationService(),
    private readonly referralService = new ReferralService(this.logger)
  ) {}

  // async createGPTModel(): Promise<string> {
  //     const companies = await this.companyService.createGPTModal();
  //     const projects = await this.projectService.createGPTModal();

  //     return companies + projects;
  // }

  async getAllResources(): Promise<PageResources> {
    const projects = await this.projectService.getAllProjectsWithCompanies()
    const experiences =
      await this.experienceService.getAllExperiencesWithCompanyProjectAndSkills()
    const educations = await this.educationService.getAllEducations()
    const referrals = await this.referralService.getAllReferrals()

    return {
      projects,
      experiences,
      educations,
      referrals
    }
  }
}
