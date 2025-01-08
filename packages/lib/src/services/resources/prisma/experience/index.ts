import { db, DbClient } from '../../../../db'
import { ResourceService } from '../../../../types'
import {
  ExperienceForGptModel,
  ExperienceWithCompanyProjectAndSkills
} from '../../../../types/prisma/experience'
import {
  ExperienceForGptModelArgs,
  ExperienceWithCompanyProjectAndSkillsArgs
} from '../../../../types/prisma/experience/prisma-args'

export class ExperienceService implements ResourceService<ExperienceWithCompanyProjectAndSkills> {
  constructor(private readonly dbClient: DbClient = db) { }

  async getAll(): Promise<
    ExperienceWithCompanyProjectAndSkills[]
  > {
    return this.dbClient.experience.findMany(
      ExperienceWithCompanyProjectAndSkillsArgs
    )
  }

  async createGPTModal(): Promise<string> {
    const experiences = await this.dbClient.experience.findMany(
      ExperienceForGptModelArgs
    )

    return experienceFormatter(experiences)
  }
}

export const experienceFormatter = (
  experiences: ExperienceForGptModel[]
): string => {
  return experiences
    .map(
      exp =>
        `Experience: ${exp.role} at ${exp.company?.name}, from ${exp.startedAt} to ${exp.finishedAt || 'present'}`
    )
    .join('\n')
}
