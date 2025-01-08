import { Logger } from 'pino'
import { PageResources } from '../../types/resources'
//TODO: temporarily disable prisma resources
// import { EducationService } from '../resources/prisma/education'
// import { ExperienceService } from '../resources/prisma/experience'
// import { ProjectService } from '../resources/prisma/project'
// import { ReferralService } from '../resources/prisma/referral'
// import { SkillService } from '../resources/prisma/skill'

import { SupabaseDbClient } from '../../types'
import { EducationService } from '../resources/supabase/education'
import { ExperienceService } from '../resources/supabase/experience'
import { ProjectService } from '../resources/supabase/project'
import { ReferralService } from '../resources/supabase/referral'
import { SkillService } from '../resources/supabase/skill'

export class ResourceManager {
  private readonly dbClient: SupabaseDbClient
  private readonly experienceService
  private readonly projectService
  private readonly educationService
  private readonly referralService
  private readonly skillService

  constructor(
    private logger: Logger,
    private client: SupabaseDbClient,
  ) {
    this.dbClient = client
    this.experienceService = new ExperienceService(this.dbClient)
    this.projectService = new ProjectService(this.dbClient)
    this.educationService = new EducationService(this.dbClient)
    this.referralService = new ReferralService(this.logger, this.dbClient)
    this.skillService = new SkillService(this.dbClient)
  }

  async getAllResources(): Promise<PageResources> {
    const projects = await this.projectService.getAll()

    console.log('projects', { projects })
    const experiences =
      await this.experienceService.getAll()

    const educations = await this.educationService.getAll()
    const referrals = await this.referralService.getAll()
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
