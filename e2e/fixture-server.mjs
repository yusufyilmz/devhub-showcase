import { createServer } from 'node:http'
import {
  authorableSectionTypes,
  getSectionRenderers
} from '../packages/content/src/authorable-sections.ts'
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
const customOwners = ['desktop', 'mobile'].map((device, index) => ({
  ...row,
  id: `abababab-abab-4bab-8bab-abababababa${index}`,
  owner_id: `cdcdcdcd-cdcd-4dcd-8dcd-cdcdcdcdcdc${index}`,
  username: `${device}-custom-owner`,
  is_public: false,
  document: {
    ...profile,
    name: 'Custom Section Owner',
    email: 'custom-owner@example.test',
    templateChosen: true
  }
}))
const mediaOwners = ['desktop', 'mobile'].map((device, index) => ({
  ...row,
  id: `dddddddd-dddd-4ddd-8ddd-ddddddddddd${index}`,
  owner_id: `eeeeeeee-eeee-4eee-8eee-eeeeeeeeeee${index}`,
  username: `${device}-media-owner`,
  is_public: false,
  document: {
    ...profile,
    name: 'Media Portfolio Owner',
    email: 'media-owner@example.test',
    templateChosen: true
  }
}))
const mediaExamples = ['engineer', 'designer', 'consultant', 'minimal'].map(
  (type, index) => ({
    ...row,
    id: `ffffffff-ffff-4fff-8fff-fffffffffff${index}`,
    username: `media-${type}`,
    document: {
      ...profile,
      portfolioType: type,
      hero: {
        kind: 'image',
        url: 'http://localhost:3100/examples/orbit-brand.svg',
        position: 'center',
        overlay: 'strong'
      },
      customSections: [
        [
          'services',
          'Services',
          'cards',
          'Design systems',
          'Brand and interface design',
          ''
        ],
        [
          'testimonials',
          'Testimonials',
          'cards',
          'A happy collaborator',
          'Thoughtful, clear work.',
          ''
        ],
        [
          'faq',
          'Questions',
          'accordion',
          'How do we start?',
          'Send a message to discuss your project.',
          ''
        ],
        ['statistics', 'Numbers', 'cards', '12+', 'Projects delivered', ''],
        [
          'cta',
          'Start a project',
          'cards',
          'Work together',
          'Tell me about your idea.',
          'https://example.com/contact'
        ],
        [
          'youtube',
          'Films',
          'cards',
          'Studio film',
          'A selected film.',
          'https://youtu.be/M7lc1UVf-VE'
        ],
        [
          'instagram',
          'Instagram projects',
          'cards',
          'Poster study',
          'A selected poster.',
          'https://www.instagram.com/p/ABC_123/'
        ],
        [
          'pinterest',
          'Pinterest work',
          'cards',
          'Visual collection',
          'A selected pin.',
          'https://www.pinterest.com/pin/123456/'
        ]
      ].map(([composition, title, renderer, itemTitle, body, url], n) => ({
        id: `custom-12345678-1234-4234-8234-${String(n).padStart(12, '0')}`,
        composition,
        title,
        renderer,
        visible: true,
        items: [
          {
            id: `87654321-4321-4321-8321-${String(n).padStart(12, '0')}`,
            title: itemTitle,
            body,
            url,
            imageUrl:
              composition === 'instagram' || composition === 'pinterest'
                ? 'http://localhost:3100/examples/orbit-brand.svg'
                : ''
          }
        ]
      }))
    }
  })
)
const libraryOwners = ['desktop', 'mobile'].map((device, index) => ({
  ...row,
  id: `10101010-1010-4010-8010-10101010101${index}`,
  owner_id: `20202020-2020-4020-8020-20202020202${index}`,
  username: `${device}-library-owner`,
  is_public: false,
  document: {
    ...profile,
    name: 'Library Portfolio Owner',
    email: 'library-owner@example.test',
    templateChosen: true
  }
}))
const libraryExamples = ['engineer', 'designer'].map((type, index) => ({
  ...row,
  id: `30303030-3030-4030-8030-30303030303${index}`,
  username: `library-${type}`,
  document: {
    ...profile,
    portfolioType: type,
    customSections: authorableSectionTypes.map((sectionType, n) => ({
      id: `custom-40404040-4040-4040-8040-${String(n).padStart(12, '0')}`,
      sectionType,
      title: `Library ${sectionType}`,
      renderer: getSectionRenderers(sectionType)[0],
      visible: true,
      options: {
        description: `An example ${sectionType} section.`,
        email: 'contact@example.test',
        actionUrl: 'https://example.test/subscribe',
        latitude: 41.38,
        longitude: 2.17
      },
      items: [
        {
          id: `50505050-5050-4050-8050-${String(n).padStart(12, '0')}`,
          title: 'Example work',
          body: 'A sample section item.',
          value: '12+',
          period: '2026',
          details: ['First detail', 'Second detail'],
          url:
            sectionType === 'instagram'
              ? 'https://www.instagram.com/p/ABC/'
              : sectionType === 'pinterest'
                ? 'https://www.pinterest.com/pin/123/'
                : 'https://youtu.be/M7lc1UVf-VE',
          imageUrl: 'http://localhost:3100/examples/orbit-brand.svg'
        }
      ]
    }))
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
const reordered = ['engineer', 'designer', 'consultant', 'minimal'].map(
  (type, index) => ({
    ...row,
    id: `77777777-7777-4777-8777-77777777777${index}`,
    username: `reordered-${type}`,
    document: {
      ...profile,
      portfolioType: type,
      sectionOrder: [
        'languages',
        'education',
        'skills',
        'projects',
        'experience',
        'about'
      ]
    }
  })
)
const configured = ['engineer', 'designer', 'consultant', 'minimal'].map(
  (type, index) => ({
    ...row,
    id: `aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa${index}`,
    username: `configured-${type}`,
    document: {
      ...profile,
      portfolioType: type,
      sectionSettings: {
        about: { visible: false },
        projects: {
          renderer: 'project-carousel',
          itemIds: [profile.projects.find((item) => item.public).id]
        },
        experience: { renderer: 'experience-tabs' },
        education: { renderer: 'education-accordion' },
        skills: { renderer: 'skill-cards' },
        languages: { renderer: 'language-cards' }
      }
    }
  })
)
const managers = [0, 1].map((n) => ({
  owner_id: `99999999-9999-4999-8999-99999999999${n}`,
  document: { email: `manager${n}@example.test` },
  manager: true
}))
const recipients = [0, 1].map((n) => ({
  owner_id: `88888888-8888-4888-8888-88888888888${n}`,
  document: { email: `recipient${n}@example.test` }
}))
const initialStarters = structuredClone(starters)
const rows = [
  row,
  ...examples,
  ...localized,
  ...reordered,
  ...configured,
  ...themed,
  systemTheme,
  ...starters,
  ...customOwners,
  ...mediaOwners,
  ...mediaExamples,
  ...libraryOwners,
  ...libraryExamples
]
const templateLibraries = new Map()
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
  if (url.pathname === '/rest/v1/rpc/is_portfolio_admin') {
    response.end(JSON.stringify(Boolean(owner?.manager)))
    return
  }
  if (url.pathname === '/rest/v1/rpc/transfer_managed_portfolio')
    return transferRequest(request, response, owner)
  if (url.pathname === '/rest/v1/portfolio_section_templates')
    return templateLibraryRequest(request, response, url, owner)
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
    owner = [
      ...starters,
      ...customOwners,
      ...libraryOwners,
      ...mediaOwners,
      ...managers,
      ...recipients
    ].find((entry) => entry.owner_id === userId)
  } catch {
    /* Public fixture requests have no fake session. */
  }
  return owner
}

function visibleRow(entry, owner) {
  return (
    entry.is_public ||
    (owner &&
      (entry.owner_id === owner.owner_id ||
        (owner.manager && entry.managed_by === owner.owner_id)))
  )
}
function matchesRow(entry, url) {
  return ['id', 'username', 'owner_id', 'managed_by', 'revision'].every(
    (key) =>
      !url.searchParams.has(key) ||
      url.searchParams.get(key) === `eq.${entry[key]}` ||
      (url.searchParams.get(key) === 'is.null' && entry[key] === null)
  )
}
function fixtureRow(url, owner) {
  return rows.find(
    (entry) => visibleRow(entry, owner) && matchesRow(entry, url)
  )
}

async function profileRequest(request, response, url, owner) {
  const found = fixtureRow(url, owner)
  if (request.method === 'GET') {
    const result =
      url.searchParams.has('managed_by') && !url.searchParams.has('id')
        ? rows.filter(
            (entry) => visibleRow(entry, owner) && matchesRow(entry, url)
          )
        : (found ?? null)
    response.end(JSON.stringify(result))
    return
  }
  if (request.method === 'POST' && owner?.manager)
    return createManagedRequest(request, response, owner)

  if (
    request.method === 'PATCH' &&
    owner &&
    found &&
    (found.owner_id === owner.owner_id ||
      (owner.manager && found.managed_by === owner.owner_id))
  ) {
    const chunks = []
    for await (const chunk of request) chunks.push(chunk)
    const update = JSON.parse(Buffer.concat(chunks).toString())
    Object.assign(found, update)
    response.end(JSON.stringify(found))
    return
  }

  response
    .writeHead(405)
    .end(JSON.stringify({ message: 'Unsupported fixture request' }))
}

async function transferRequest(request, response, owner) {
  const chunks = []
  for await (const chunk of request) chunks.push(chunk)
  const input = JSON.parse(Buffer.concat(chunks).toString())
  const found = rows.find(
    (item) =>
      item.id === input.profile_id && item.managed_by === owner?.owner_id
  )
  const target = recipients.find(
    (item) => item.document.email === input.target_email
  )
  if (
    !owner?.manager ||
    !found ||
    !target ||
    found.revision !== input.expected_revision
  ) {
    response.writeHead(400).end(
      JSON.stringify({
        code: '22023',
        message: 'Ask the recipient to sign in with Google first'
      })
    )
    return
  }
  found.owner_id = target.owner_id
  found.managed_by = null
  found.revision++
  response.end(JSON.stringify({ id: found.id, username: found.username }))
  return
}

async function createManagedRequest(request, response, owner) {
  const chunks = []
  for await (const chunk of request) chunks.push(chunk)
  const input = JSON.parse(Buffer.concat(chunks).toString())
  if (input.managed_by !== owner.owner_id || input.owner_id !== null) {
    response.writeHead(403).end('{}')
    return
  }
  if (rows.some((entry) => entry.username === input.username)) {
    response.writeHead(409).end(JSON.stringify({ code: '23505' }))
    return
  }
  const created = {
    ...input,
    id: crypto.randomUUID(),
    revision: 1,
    updated_at: new Date().toISOString(),
    is_public: false
  }
  rows.push(created)
  response.writeHead(201).end(JSON.stringify(created))
  return
}

async function templateLibraryRequest(request, response, url, owner) {
  if (!owner) {
    response.writeHead(403).end('{}')
    return
  }
  const id = owner.owner_id
  const existing = templateLibraries.get(id)
  if (request.method === 'GET') {
    response.end(
      JSON.stringify(
        url.searchParams.get('owner_id') === `eq.${id}`
          ? (existing ?? null)
          : null
      )
    )
    return
  }
  const chunks = []
  for await (const chunk of request) chunks.push(chunk)
  const input = JSON.parse(Buffer.concat(chunks).toString())
  if (request.method === 'POST') {
    if (input.owner_id !== id) {
      response.writeHead(403).end('{}')
      return
    }
    if (existing) {
      response.writeHead(409).end(JSON.stringify({ code: '23505' }))
      return
    }
    templateLibraries.set(id, input)
    response.end(JSON.stringify(input))
    return
  }
  if (
    request.method === 'PATCH' &&
    existing &&
    url.searchParams.get('owner_id') === `eq.${id}` &&
    url.searchParams.get('revision') === `eq.${existing.revision}`
  ) {
    Object.assign(existing, input)
    response.end(JSON.stringify(existing))
    return
  }
  response.end('null')
}
