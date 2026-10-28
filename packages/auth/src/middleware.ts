import { createServerClient } from '@supabase/ssr'
import { type NextRequest, NextResponse } from 'next/server'
import { supabaseConfig } from './config'

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request })
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !(
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    )
  )
    return response
  const { url, key } = supabaseConfig()
  const supabase = createServerClient(url, key, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll(cookies) {
        for (const { name, value } of cookies) request.cookies.set(name, value)
        response = NextResponse.next({ request })
        for (const { name, value, options } of cookies)
          response.cookies.set(name, value, options)
      }
    }
  })
  await supabase.auth.getUser()
  return response
}
