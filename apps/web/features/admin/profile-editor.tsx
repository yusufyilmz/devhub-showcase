'use client'
import type { PortfolioProfile } from '@shared/content'
import type { ProfileSnapshot } from '@shared/lib/profile-errors'
import { cvPath, editCvPath } from '@shared/lib/username'
import { useEffect, useState } from 'react'
import { AppearanceEditor } from './appearance-editor'
import {
  EducationEditor,
  ExperienceEditor,
  LanguagesEditor,
  ProjectsEditor
} from './career-editors'
import { CvSettingsEditor } from './cv-settings-editor'
import { ProfileFields } from './profile-fields'
import { SkillsEditor } from './skills-editor'

const tabs = [
  'Profile',
  'Experience',
  'Projects',
  'Education',
  'Skills',
  'Languages',
  'Appearance',
  'PDF'
] as const
function clean(profile: PortfolioProfile): PortfolioProfile {
  const lines = (values: string[]) => values.filter((value) => value.trim())
  return {
    ...profile,
    about: lines(profile.about),
    experiences: profile.experiences.map((item) => ({
      ...item,
      achievements: lines(item.achievements)
    })),
    projects: profile.projects.map((item) => ({
      ...item,
      skills: lines(item.skills)
    })),
    skills: Object.fromEntries(
      Object.entries(profile.skills).map(([key, values]) => [
        key,
        lines(values)
      ])
    )
  }
}
export function ProfileEditor({ initial }: { initial: ProfileSnapshot }) {
  const [saved, setSaved] = useState(initial)
  const [username, setUsername] = useState(initial.username ?? '')
  const [draft, setDraft] = useState(initial.profile)
  const [isPublic, setIsPublic] = useState(initial.isPublic ?? false)
  const [tab, setTab] = useState<(typeof tabs)[number]>('Profile')
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const dirty =
    JSON.stringify(draft) !== JSON.stringify(saved.profile) ||
    isPublic !== (saved.isPublic ?? false) ||
    username !== (saved.username ?? '')
  useEffect(() => {
    const warn = (event: BeforeUnloadEvent) => {
      if (dirty) {
        event.preventDefault()
        event.returnValue = ''
      }
    }
    window.addEventListener('beforeunload', warn)
    return () => window.removeEventListener('beforeunload', warn)
  }, [dirty])
  async function publish() {
    setBusy(true)
    setError('')
    setMessage('')
    try {
      const response = await fetch('/api/admin/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profile: clean(draft),
          revision: saved.revision,
          isPublic,
          ...(username ? { username } : {})
        })
      })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error)
      if (result.username && result.username !== saved.username)
        window.history.replaceState(null, '', editCvPath(result.username))
      setUsername(result.username ?? username)
      setSaved(result)
      setDraft(result.profile)
      setIsPublic(result.isPublic ?? isPublic)
      setMessage('Saved. Your CV now uses these details.')
    } catch (reason) {
      setError(
        reason instanceof Error
          ? reason.message
          : 'Could not publish. Your changes are still here.'
      )
    } finally {
      setBusy(false)
    }
  }
  return (
    <main id="admin-content" className="studio">
      <form
        onSubmit={(event) => {
          event.preventDefault()
          void publish()
        }}
      >
        <div className="studio-heading">
          <div>
            <p className="eyebrow">A SPACE FOR YOUR STORY</p>
            <h1>
              Make it <span>yours.</span>
            </h1>
            <p>Keep your portfolio as current as your work.</p>
          </div>
          <div className="studio-header-actions">
            {saved.isPublic && saved.id && (
              <a
                href={saved.username ? cvPath(saved.username) : '/'}
                target="_blank"
                rel="noopener noreferrer"
                className="studio-secondary"
              >
                View public profile ↗
              </a>
            )}
            <button
              type="submit"
              className="studio-primary"
              disabled={busy || !dirty}
            >
              {busy ? 'Saving…' : 'Save changes'}
            </button>
          </div>
        </div>
        <div className="studio-status">
          <span className={dirty ? 'status-dot unsaved' : 'status-dot'} />
          {dirty ? 'You have unsaved changes' : 'All changes saved'}
          <span>Revision {saved.revision}</span>
          <button
            type="button"
            disabled={busy}
            onClick={async () => {
              if (
                dirty &&
                !window.confirm('Leave without publishing your changes?')
              )
                return
              setBusy(true)
              try {
                const response = await fetch('/api/admin/session', {
                  method: 'DELETE'
                })
                if (!response.ok) throw new Error('Could not sign out.')
                window.location.assign('/admin/login')
              } catch (reason) {
                setError(
                  reason instanceof Error
                    ? reason.message
                    : 'Could not sign out.'
                )
                setBusy(false)
              }
            }}
          >
            Sign out
          </button>
        </div>
        <div className="editor-card studio-sharing">
          <label htmlFor="cv-username">Username</label>
          <input
            id="cv-username"
            value={username}
            minLength={3}
            maxLength={50}
            pattern="[a-z0-9]+(-[a-z0-9]+)*"
            onChange={(event) => setUsername(event.target.value.toLowerCase())}
            disabled={busy}
          />
          <p>
            Your public CV: /{username || 'username'} · Your editor: /
            {username || 'username'}/edit. Changing your username changes your
            links.
          </p>
          <label>
            <input
              type="checkbox"
              checked={isPublic}
              onChange={(event) => setIsPublic(event.target.checked)}
              disabled={busy}
            />{' '}
            Publish my profile and CV at a public link
          </label>
          <p>
            {isPublic
              ? 'Anyone with the link can read your published contact and career details.'
              : 'Your CV is private. Only you can read and download it.'}
          </p>
          <a href="/api/admin/cv" className="studio-secondary">
            Download my saved CV
          </a>
          {saved.isPublic && saved.id && (
            <a
              href={saved.username ? cvPath(saved.username) : `/p/${saved.id}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Open share link ↗
            </a>
          )}
        </div>
        <nav className="editor-tabs" aria-label="Editor sections">
          {tabs.map((item) => (
            <button
              key={item}
              type="button"
              aria-current={tab === item ? 'page' : undefined}
              onClick={() => setTab(item)}
            >
              {item}
            </button>
          ))}
        </nav>
        {error && (
          <div className="editor-alert" role="alert">
            <p>{error}</p>
            <button
              type="button"
              disabled={busy}
              onClick={() => {
                if (window.confirm('Reload and discard unpublished changes?'))
                  window.location.reload()
              }}
            >
              Reload latest version
            </button>
          </div>
        )}
        {message && (
          <p className="editor-success" role="status">
            {message}
          </p>
        )}
        <fieldset disabled={busy} className="editor-body">
          <legend className="sr-only">{tab} editor</legend>
          {tab === 'Profile' && (
            <ProfileFields profile={draft} onChange={setDraft} />
          )}
          {tab === 'Experience' && (
            <ExperienceEditor profile={draft} onChange={setDraft} />
          )}
          {tab === 'Projects' && (
            <ProjectsEditor profile={draft} onChange={setDraft} />
          )}
          {tab === 'Education' && (
            <EducationEditor profile={draft} onChange={setDraft} />
          )}
          {tab === 'Skills' && (
            <SkillsEditor profile={draft} onChange={setDraft} />
          )}
          {tab === 'Languages' && (
            <LanguagesEditor profile={draft} onChange={setDraft} />
          )}
          {tab === 'PDF' && (
            <CvSettingsEditor profile={draft} onChange={setDraft} />
          )}
          {tab === 'Appearance' && (
            <AppearanceEditor profile={draft} onChange={setDraft} />
          )}
        </fieldset>
        <footer className="editor-footer">
          <p>Save your edits to update your CV. Public sharing is optional.</p>
          <button
            className="studio-secondary"
            type="button"
            disabled={!dirty || busy}
            onClick={() => {
              if (window.confirm('Discard unpublished changes?')) {
                setDraft(saved.profile)
                setUsername(saved.username ?? '')
                setIsPublic(saved.isPublic ?? false)
                setError('')
                setMessage('')
              }
            }}
          >
            Discard changes
          </button>
        </footer>
      </form>
    </main>
  )
}
