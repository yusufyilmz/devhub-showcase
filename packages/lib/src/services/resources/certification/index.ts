import { Certification } from '../../../types/certification'
import { CertificationForCvModelArgs } from '../../../types/certification/prisma-args'
import { certificationFormatter } from '../../formatter'
import { DbClient, db } from '../../../db'

export class CertificationService {
  constructor(private readonly dbClient: DbClient = db) {}

  async getAllCertifications(): Promise<Certification[]> {
    return this.dbClient.certification.findMany()
  }

  async createGPTModal(): Promise<string> {
    const experiences = await this.dbClient.certification.findMany({
      ...CertificationForCvModelArgs
    })

    return certificationFormatter(experiences)
  }
}
