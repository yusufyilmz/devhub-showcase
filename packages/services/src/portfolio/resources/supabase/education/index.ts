import type { Education, ResourceService, SupabaseDbClient } from "@shared/lib/types";
import { keysToCamelCase } from "@shared/lib/utils";

export class EducationService implements ResourceService<Education> {
  private readonly dbClient: SupabaseDbClient;

  constructor(client: SupabaseDbClient) {
    this.dbClient = client;
  }

  async getAll(): Promise<Education[]> {
    const { data, error } = await this.dbClient.from("educations").select("*");

    if (error) {
      throw new Error(error.message);
    }

    return keysToCamelCase<Education[]>(data);
  }

  async createGPTModal(): Promise<string> {
    const { data, error } = await this.dbClient.from("educations").select(`
        institution,
        degree,
        field_of_study,
        started_at,
        finished_at,
        gpa,
        description
      `);

    if (error) {
      throw new Error(error.message);
    }

    return educationFormatter(keysToCamelCase<Education[]>(data));
  }
}

export const educationFormatter = (educations: Education[]): string => {
  return educations
    .map(
      (edu) =>
        `Education: ${edu.degree} in ${edu.fieldOfStudy} from ${edu.institution}, from ${edu.startedAt} to ${edu.finishedAt || "present"}`,
    )
    .join("\n");
};
