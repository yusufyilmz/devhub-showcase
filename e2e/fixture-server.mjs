import { createServer } from 'node:http'
import { profile } from '../packages/content/src/profile.ts'

// Test-only transport fixture, never imported by application code. Public
// records are read only. Two isolated fake accounts can save their own starter.
const row = {
  id: 'main',
  owner_id: null,
  username: 'yusufyilmz',
  is_public: true,
  document: profile,
  revision: 1,
  updated_at: '2026-01-01T00:00:00Z'
}
const examples = ['designer', 'consultant', 'minimal'].map((type, index) => ({
  ...row,
  id: `11111111-1111-4111-8111-11111111110${index}`,
  username: `${type}-example`,
  document: {
    ...profile,
    name: `${type[0].toUpperCase()}${type.slice(1)} Example`,
    portfolioType: type
  }
}))
const localized = ['en', 'es', 'tr'].flatMap((language, languageIndex) =>
  ['engineer', 'designer', 'consultant', 'minimal'].map((type, typeIndex) => ({
    ...row,
    id: `44444444-4444-4444-8444-${String(languageIndex * 4 + typeIndex).padStart(12, '0')}`,
    username: `${type}-${language}`,
    document: {
      ...profile,
      portfolioType: type,
      portfolioLanguage: language,
      cvLanguage: language === 'es' ? 'tr' : language
    }
  }))
)
const starters = ['desktop', 'mobile'].map((device, index) => ({
  ...row,
  id: `22222222-2222-4222-8222-22222222222${index}`,
  owner_id: `33333333-3333-4333-8333-33333333333${index}`,
  username: `${device}-starter`,
  is_public: false,
  document: {
    ...profile,
    name: 'New Portfolio Owner',
    email: 'owner@example.test',
    templateChosen: false,
    appearance: { theme: 'studio', accent: 'cyan', defaultTheme: 'system' },
    title: 'Add your professional title',
    summary: 'Add a short professional summary.',
    phone: '',
    website: '',
    github: '',
    linkedin: '',
    experiences: [],
    projects: [],
    education: [],
    skills: {},
    languages: [],
    about: []
  }
}))
const themed = ['studio', 'paper', 'graphite', 'bloom'].flatMap(
  (theme, themeIndex) =>
    ['engineer', 'designer', 'consultant', 'minimal'].map(
      (type, typeIndex) => ({
        ...row,
        id: `55555555-5555-4555-8555-${String(themeIndex * 4 + typeIndex).padStart(12, '0')}`,
        username: `${theme}-${type}`,
        document: {
          ...profile,
          portfolioType: type,
          appearance: { theme, accent: 'violet', defaultTheme: 'dark' }
        }
      })
    )
)
const systemTheme = {
  ...row,
  id: '66666666-6666-4666-8666-666666666666',
  username: 'paper-system',
  document: {
    ...profile,
    portfolioType: 'designer',
    appearance: { theme: 'paper', accent: 'cyan', defaultTheme: 'system' }
  }
}
const initialStarters = structuredClone(starters)
const rows = [
  row,
  ...examples,
  ...localized,
  ...themed,
  systemTheme,
  ...starters
]
createServer(async (request, response) => {
  const url = new URL(request.url, 'http://127.0.0.1:3101')
  response.setHeader('Content-Type', 'application/json')
  const resetIndex = ['desktop', 'mobile'].indexOf(
    url.pathname.replace('/__test/reset/', '')
  )
  if (request.method === 'POST' && resetIndex >= 0) {
    Object.assign(
      starters[resetIndex],
      structuredClone(initialStarters[resetIndex])
    )
    response.end('{}')
    return
  }
  const owner = fixtureOwner(request)
  if (request.method === 'GET' && url.pathname === '/health') {
    response.end('{}')
    return
  }
  if (request.method === 'GET' && url.pathname === '/auth/v1/user' && owner) {
    response.end(
      JSON.stringify({
        id: owner.owner_id,
        aud: 'authenticated',
        role: 'authenticated',
        email: owner.document.email,
        email_confirmed_at: '2026-01-01T00:00:00Z',
        app_metadata: {},
        user_metadata: {}
      })
    )
    return
  }
  if (url.pathname === '/rest/v1/portfolio_profiles')
    return profileRequest(request, response, url, owner)
  if (request.method === 'GET' && url.pathname === '/rest/v1/referrals') {
    response.end('[]')
    return
  }
  response
    .writeHead(405)
    .end(JSON.stringify({ message: 'Unsupported fixture request' }))
}).listen(3101, '127.0.0.1')

function fixtureOwner(request) {
  let owner
  try {
    const token = request.headers.authorization?.split(' ')[1]
    const userId = JSON.parse(Buffer.from(token.split('.')[1], 'base64url')).sub
    owner = starters.find((entry) => entry.owner_id === userId)
  } catch {
    /* Public fixture requests have no fake session. */
  }
  return owner
}

function fixtureRow(url, owner) {
  return rows.find((entry) => {
    if (!entry.is_public && entry !== owner) return false
    return ['id', 'username', 'owner_id', 'revision'].every(
      (key) =>
        !url.searchParams.has(key) ||
        url.searchParams.get(key) === `eq.${entry[key]}`
    )
  })
}

async function profileRequest(request, response, url, owner) {
  const found = fixtureRow(url, owner)
  if (request.method === 'GET') {
    response.end(JSON.stringify(found ?? null))
    return
  }
  if (request.method === 'PATCH' && owner && found === owner) {
    const chunks = []
    for await (const chunk of request) chunks.push(chunk)
    const update = JSON.parse(Buffer.concat(chunks).toString())
    Object.assign(owner, update)
    response.end(JSON.stringify(owner))
    return
  }

  response
    .writeHead(405)
    .end(JSON.stringify({ message: 'Unsupported fixture request' }))
}
