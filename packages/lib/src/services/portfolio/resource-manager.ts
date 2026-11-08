import type { Logger } from "@shared/utils/logger";

import { EducationService } from "../../repositories/portfolio/education";
import { ExperienceService } from "../../repositories/portfolio/experience";
import { ProjectService } from "../../repositories/portfolio/project";
import { ReferralService } from "../../repositories/portfolio/referral";
import { SkillService } from "../../repositories/portfolio/skill";
import type { PageResources, SupabaseDbClient } from "../../types/index";

export class ResourceManager {
  private readonly dbClient: SupabaseDbClient;
  private readonly experienceService;
  private readonly projectService;
  private readonly educationService;
  private readonly referralService;
  private readonly skillService;

  constructor(
    private logger: Logger,
    client: SupabaseDbClient,
  ) {
    this.dbClient = client;
    this.experienceService = new ExperienceService(this.dbClient);
    this.projectService = new ProjectService(this.dbClient);
    this.educationService = new EducationService(this.dbClient);
    this.referralService = new ReferralService(this.logger, this.dbClient);
    this.skillService = new SkillService(this.dbClient);
  }

  async getAllResources(): Promise<PageResources> {
    const projects = await this.projectService.getAll();
    const experiences = await this.experienceService.getAll();

    const educations = await this.educationService.getAll();
    const referrals = await this.referralService.getAll();
    const skills = await this.skillService.getCategorizedSkills();

    return {
      educations,
      experiences,
      projects,
      referrals,
      skills,
    };
  }
}
