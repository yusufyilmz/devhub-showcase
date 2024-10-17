import { Characteristic } from '../../../types/characteristic'
import { CharacteristicForCvModelArgs } from '../../../types/characteristic/prisma-args'
import { characteristicFormatter } from '../../formatter'
import { DbClient, db } from '../../../db'

export class CharacteristicService {
  constructor(private readonly dbClient: DbClient = db) {}

  async getAllCharacteristics(): Promise<Characteristic[]> {
    return this.dbClient.characteristic.findMany()
  }

  async createGPTModal(): Promise<string> {
    const experiences = await this.dbClient.characteristic.findMany({
      ...CharacteristicForCvModelArgs
    })

    return characteristicFormatter(experiences)
  }
}
