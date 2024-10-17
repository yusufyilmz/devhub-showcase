import { db, DbClient } from '../../../db'
import {
  ExperienceForCvModel,
  ExperienceWithCompanyProjectAndSkills
} from '../../../types/experience'
import {
  ExperienceForCvModelArgs,
  ExperienceWithCompanyProjectAndSkillsArgs
} from '../../../types/experience/prisma-args'

export class ExperienceService {
  constructor(private readonly dbClient: DbClient = db) {}

  async getAllExperiencesWithCompanyProjectAndSkills(): Promise<
    ExperienceWithCompanyProjectAndSkills[]
  > {
    return this.dbClient.experience.findMany(
      ExperienceWithCompanyProjectAndSkillsArgs
    )
  }

  async createGPTModal(): Promise<string> {
    const experiences = await this.dbClient.experience.findMany(
      ExperienceForCvModelArgs
    )

    return experienceFormatter(experiences)
  }
}

export const experienceFormatter = (
  experiences: ExperienceForCvModel[]
): string => {
  return experiences
    .map(
      exp =>
        `Experience: ${exp.role} at ${exp.company?.name}, from ${exp.startedAt} to ${exp.finishedAt || 'present'}`
    )
    .join('\n')
}
