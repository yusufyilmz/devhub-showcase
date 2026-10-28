'use client'
import { useState } from 'react'
export function AdminLogin() {
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  return (
    <main id="admin-content" className="admin-login">
      <p className="eyebrow">YOUR CONTENT, YOUR CONTROL</p>
      <h1>
        Welcome to your
        <br />
        <span>portfolio studio.</span>
      </h1>
      <p>Sign in to update your story, projects and experience.</p>
      <form
        onSubmit={async (event) => {
          event.preventDefault()
          setError('')
          setBusy(true)
          const fields = new FormData(event.currentTarget)
          try {
            const response = await fetch('/api/admin/session', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                email: fields.get('email'),
                password: fields.get('password')
              })
            })
            const result = await response.json()
            if (!response.ok) throw new Error(result.error)
            window.location.assign('/admin')
          } catch (reason) {
            setError(
              reason instanceof Error ? reason.message : 'Could not sign in.'
            )
          } finally {
            setBusy(false)
          }
        }}
      >
        <label>
          Email
          <input type="email" name="email" autoComplete="username" required />
        </label>
        <label>
          Password
          <input
            type="password"
            name="password"
            autoComplete="current-password"
            required
          />
        </label>
        <button className="studio-primary" disabled={busy} type="submit">
          {busy ? 'Signing in…' : 'Open studio →'}
        </button>
        {error && (
          <p role="alert" className="form-error">
            {error}
          </p>
        )}
      </form>
      <a href="/">← Back to portfolio</a>
    </main>
  )
}
