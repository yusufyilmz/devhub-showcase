import { createBrowserClient } from "@supabase/ssr";
import { supabaseConfig } from "./config";

export function createClient<Database = unknown>() {
  const { url, key } = supabaseConfig();
  // Create a supabase client on the browser with project's credentials
  return createBrowserClient<Database>(url, key);
}
