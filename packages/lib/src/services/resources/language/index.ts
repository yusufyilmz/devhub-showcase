import { DbClient, db } from '../../../db'
import { LanguageForCvModelArgs } from '../../../types/language/prisma-args'
import { languageFormatter } from '../../formatter'
import { Language } from '../../../types'

export class LanguageService {
  constructor(
    private readonly dbClient: DbClient = db
  ) {}

  async getAllLanguages(): Promise<Language[]> {
    return this.dbClient.language.findMany()
  }

  async createGPTModal(): Promise<string> {
    const experiences = await this.dbClient.language.findMany({
      ...LanguageForCvModelArgs
    })

    return languageFormatter(experiences)
  }
}
