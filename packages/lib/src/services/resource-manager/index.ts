import { Logger } from 'pino'
import { PageResources } from '../../types/resources'
import { EducationService } from '../resources/education'
import { ExperienceService } from '../resources/experience'
import { ProjectService } from '../resources/project'
import { ReferralService } from '../resources/referral'
import { CVCategoryType } from '../../types'
import { AchievementService } from '../resources/achievement'
import { CertificationService } from '../resources/certification'
import { ChallengeService } from '../resources/challenge'
import { SkillService } from '../resources/skill'
import { CharacteristicService } from '../resources/characteristic'
import { LanguageService } from '../resources/language'

export class ResourceManager {
  constructor(
    private logger: Logger,
    private readonly experienceService = new ExperienceService(),
    private readonly projectService = new ProjectService(),
    private readonly educationService = new EducationService(),
    private readonly referralService = new ReferralService(),
    private readonly challengeService = new ChallengeService(),
    private readonly characteristicService = new CharacteristicService(),
    private readonly certificationService = new CertificationService(),
    private readonly skillService = new SkillService(),
    private readonly achievementService = new AchievementService(),
    private readonly languageService = new LanguageService(),

  ) { }

  categoryToModalMap(): Record<CVCategoryType, Promise<string>> {
    return {
      'projects': this.projectService.createGPTModal(),
      'experience': this.experienceService.createGPTModal(),
      'education': this.educationService.createGPTModal(),
      'referrals': this.referralService.createGPTModal(),
      'achievements': this.achievementService.createGPTModal(),
      'certifications': this.certificationService.createGPTModal(),
      'challenges': this.challengeService.createGPTModal(),
      'skills': this.skillService.createGPTModal(),
      'characteristic': this.characteristicService.createGPTModal(),
      'languages': this.languageService.createGPTModal(),
      'workPreferences': Promise.resolve(''),
    };
  }

  async createCvModal(): Promise<string> {
    let result: string = ''

    const categoryToModalMap = this.categoryToModalMap();

    for (const category of Object.keys(categoryToModalMap)) {
      result += `${category}: ${await categoryToModalMap[category as CVCategoryType]}\n`;
    }

    return result;
  }

  async createCvModalForCategory(category: CVCategoryType): Promise<string> {
    return this.categoryToModalMap()[category]; 
  }


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
