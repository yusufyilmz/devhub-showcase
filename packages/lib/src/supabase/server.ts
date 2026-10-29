import { createClient as createAuthClient } from '@shared/auth/server'
import type { Database } from '../types/supabase/database.types'
export const createClient = () => createAuthClient<Database>()
