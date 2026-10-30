import { saveProfileSchema } from "../domain/profile";
import {
  ProfileAccessError,
  ProfileConflictError,
  type ProfileRepository,
} from "../repositories/profile-repository";
export class ProfileService {
  constructor(private readonly repository: ProfileRepository) {}
  async requireOwner(userId: string | null | undefined) {
    if (!userId || !(await this.repository.isOwner(userId)))
      throw new ProfileAccessError();
  }
  async save(userId: string | null | undefined, input: unknown) {
    await this.requireOwner(userId);
    const data = saveProfileSchema.parse(input);
    const saved = await this.repository.save(
      data.profile,
      data.revision,
      data.isPublic,
      data.username,
    );
    if (!saved) throw new ProfileConflictError();
    return saved;
  }
}
