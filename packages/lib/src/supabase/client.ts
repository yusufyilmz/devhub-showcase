import { createBrowserClient } from '@supabase/ssr'
import type { Database } from '../types/supabase/database.types'
import { supabaseConfig } from './config'

export function createClient() {
  const { url, key } = supabaseConfig()
  // Create a supabase client on the browser with project's credentials
  return createBrowserClient<Database>(url, key)
}
