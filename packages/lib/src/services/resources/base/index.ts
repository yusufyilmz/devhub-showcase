import { CacheService } from "@shared/cache";
import { DbClient, db } from "../../../db";
import { Prisma, PrismaClient } from "@prisma/client";

const {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    Review,
    ...prismaModelName
} = Prisma.ModelName
/* eslint-enable @typescript-eslint/no-unused-vars */

export const PrismaModelName = prismaModelName

export type PrismaModelName =
    (typeof PrismaModelName)[keyof typeof PrismaModelName]


    type ModelNameFor<T> =
    T extends Prisma.CompanyDelegate<any> ? 'Company' :
    T extends Prisma.SkillDelegate<any> ? 'Skill' :
    never;
    
export abstract class ResourceService<T> {

    constructor(protected readonly dbClient: DbClient = db, protected readonly cacheService: CacheService = new CacheService()) {
    }

    getModelName<T>(model: T): ModelNameFor<T> {
        if (model instanceof this.dbClient.company) {
            return 'Company';
        }
        
        throw new Error("Unknown model");
    }


    protected async resolveWithCache(key: PrismaModelName): Promise<T[]> {

        const cachedData = await this.cacheService.has<T[]>(key);
        if (cachedData) {
            return cachedData;
        }

        // @ts-ignore
        const modelDelegate = this.dbClient[key].findMany()
        const dbData = await modelDelegate.findMany<T>();

        if (dbData.length === 0) {

            await this.cacheService.set<T[]>(key, dbData);
            return dbData;
        }

        return []
    }

    abstract getAll(): Promise<T[]>

    abstract createGPTModal(): Promise<string>
}