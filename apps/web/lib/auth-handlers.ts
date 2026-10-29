import { createAuthHandlers } from '@shared/auth/handlers'
import { ProfileAccessError } from '@shared/lib/profile-errors'
import { createServerClient } from '@shared/lib/supabase'
import { requireWorkspace } from './admin-auth'

export const authHandlers = createAuthHandlers({
  createClient: createServerClient,
  afterSignIn: requireWorkspace,
  loginPath: '/admin/login',
  successPath: '/admin',
  callbackPath: '/auth/callback',
  isAccessError: (error) => error instanceof ProfileAccessError,
  accessErrorCode: 'not_owner',
  accessErrorMessage:
    'Confirm your account before opening your portfolio studio.',
  setupErrorMessage: 'Portfolio storage is not ready. Check the Supabase setup.'
})
