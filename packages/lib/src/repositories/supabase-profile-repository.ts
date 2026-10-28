import type { PortfolioProfile } from '@shared/content'
import { validateProfile } from '../domain/profile'
import type { SupabaseDbClient } from '../types'
import type { Json } from '../types/supabase/database.types'
import {
  type ProfileRepository,
  ProfileSetupError,
  type ProfileSnapshot
} from './profile-repository'

type ProfileRow = {
  id: string
  is_public: boolean
  document: Json
  revision: number
  updated_at: string
}
const snapshot = (row: ProfileRow): ProfileSnapshot => ({
  id: row.id,
  isPublic: row.is_public,
  profile: validateProfile(row.document),
  revision: row.revision,
  updatedAt: row.updated_at
})
export class SupabaseProfileRepository implements ProfileRepository {
  constructor(
    private readonly client: SupabaseDbClient,
    readonly id = 'main'
  ) {}
  async read() {
    const { data, error } = await this.client
      .from('portfolio_profiles')
      .select('id, is_public, document, revision, updated_at')
      .eq('id', this.id)
      .maybeSingle()
    if (error) throw new ProfileSetupError()
    return data ? snapshot(data) : null
  }
  async isOwner(userId: string) {
    const { data, error } = await this.client
      .from('portfolio_profiles')
      .select('id')
      .eq('id', this.id)
      .eq('owner_id', userId)
      .maybeSingle()
    if (error) throw new ProfileSetupError()
    return Boolean(data)
  }
  async save(profile: PortfolioProfile, revision: number, isPublic?: boolean) {
    const { data, error } = await this.client
      .from('portfolio_profiles')
      .update({
        document: profile as unknown as Json,
        ...(isPublic === undefined ? {} : { is_public: isPublic }),
        revision: revision + 1,
        updated_at: new Date().toISOString()
      })
      .eq('id', this.id)
      .eq('revision', revision)
      .select('id, is_public, document, revision, updated_at')
      .maybeSingle()
    if (error) throw new Error('Could not save your profile. Please try again.')
    return data ? snapshot(data) : null
  }
}
