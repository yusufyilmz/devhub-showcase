import { type BrowserContext, expect, test } from '@playwright/test'

async function signIn(context: BrowserContext, id: string, email: string) {
  const exp = Math.floor(Date.now() / 1000) + 3600
  const token = [
    Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString(
      'base64url'
    ),
    Buffer.from(
      JSON.stringify({ sub: id, exp, aud: 'authenticated' })
    ).toString('base64url'),
    Buffer.from('fixture-only-signature').toString('base64url')
  ].join('.')
  const session = {
    access_token: token,
    refresh_token: 'fixture-refresh',
    token_type: 'bearer',
    expires_in: 3600,
    expires_at: exp,
    user: { id, email }
  }
  await context.addCookies([
    {
      name: 'sb-127-auth-token',
      value: `base64-${Buffer.from(JSON.stringify(session)).toString('base64url')}`,
      url: 'http://localhost:3100',
      sameSite: 'Lax'
    }
  ])
}
test('signed out visitors cannot open management pages or create temporary profiles', async ({
  page
}) => {
  expect((await page.goto('/admin/portfolios'))?.status()).toBe(404)
  const result = await page.request.post('/api/admin/managed', {
    headers: { Origin: 'http://localhost:3100' },
    data: {}
  })
  expect(result.status()).toBe(403)
  const pdf = await page.request.get(
    '/admin/portfolios/99999999-9999-4999-8999-999999999999/cv.pdf'
  )
  expect(pdf.status()).toBe(403)
})
test('an administrator creates, edits, publishes, hides and transfers an imported portfolio', async ({
  page,
  context
}, info) => {
  const n = info.project.name.startsWith('mobile') ? 1 : 0
  await signIn(
    context,
    `99999999-9999-4999-8999-99999999999${n}`,
    `manager${n}@example.test`
  )
  await page.goto('/admin/portfolios')
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    'Manage portfolios'
  )
  await page.getByLabel('Import portfolio JSON').setInputFiles({
    name: 'portfolio.json',
    mimeType: 'application/json',
    buffer: Buffer.from(
      JSON.stringify({
        username: `managed-import-${n}`,
        profile: {
          name: 'Creative Import',
          title: 'Visual designer',
          location: 'Not specified',
          email: 'pending@example.com',
          phone: '',
          website: '',
          github: '',
          linkedin: '',
          summary: 'An imported creative portfolio.',
          about: ['Work and visual stories.'],
          portfolioType: 'designer',
          templateChosen: true,
          experiences: [],
          projects: [],
          education: [],
          skills: { Creative: ['Illustration'] },
          languages: [],
          cvUrl: '/cv.pdf',
          appearance: { theme: 'bloom', accent: 'violet', defaultTheme: 'dark' }
        }
      })
    )
  })
  await expect(page.getByLabel('Name', { exact: true })).toHaveValue(
    'Creative Import'
  )
  await page.getByRole('button', { name: 'Create private portfolio' }).click()
  await expect(page).toHaveURL(/\/admin\/portfolios\/[a-f0-9-]+$/)
  const editorUrl = page.url()
  await expect(page.getByLabel('Full name')).toHaveValue('Creative Import')
  await expect(
    page.getByLabel('Publish my profile and CV at a public link')
  ).not.toBeChecked()
  const privatePdf = await page.request.get(`${editorUrl}/cv.pdf`)
  expect(privatePdf.status()).toBe(200)
  expect((await privatePdf.body()).subarray(0, 5).toString()).toBe('%PDF-')
  await page.getByLabel('Full name').fill('Creative Managed')
  await page
    .getByLabel('Username', { exact: true })
    .fill(`managed-portfolio-${n}`)
  await page.getByLabel('Publish my profile and CV at a public link').check()
  await page.getByRole('button', { name: 'Save changes' }).click()
  await expect(page.locator('.editor-success')).toContainText('Saved')
  await expect(page).toHaveURL(editorUrl)
  await page.reload()
  await expect(page.getByLabel('Full name')).toHaveValue('Creative Managed')
  await page.screenshot({
    path: info.outputPath('managed-editor.png'),
    fullPage: true
  })
  const visitor = await context.browser()?.newContext()
  if (!visitor) throw new Error('Missing browser')
  const publicPage = await visitor.newPage()
  await publicPage.goto(`http://localhost:3100/managed-portfolio-${n}`)
  await expect(publicPage.getByRole('heading', { level: 1 })).toContainText(
    'Creative Managed'
  )
  await page.getByLabel('Publish my profile and CV at a public link').uncheck()
  await page.getByRole('button', { name: 'Save changes' }).click()
  await expect(page.locator('.editor-success')).toContainText('Saved')
  expect((await publicPage.reload())?.status()).toBe(404)
  await page.getByLabel('Owner account email').fill('missing@example.test')
  page.once('dialog', (dialog) => dialog.accept())
  await page.getByRole('button', { name: 'Transfer portfolio' }).click()
  await expect(page.locator('.editor-alert')).toContainText(
    'sign in with Google'
  )
  await page
    .getByLabel('Owner account email')
    .fill(`recipient${n}@example.test`)
  page.once('dialog', (dialog) => dialog.accept())
  await page.getByRole('button', { name: 'Transfer portfolio' }).click()
  await expect(page).toHaveURL('/admin/portfolios')
  await expect(page.getByRole('link', { name: 'Edit portfolio' })).toHaveCount(
    0
  )
  expect((await page.request.get(`${editorUrl}/cv.pdf`)).status()).toBe(403)
  await context.clearCookies()
  await signIn(
    context,
    `88888888-8888-4888-8888-88888888888${n}`,
    `recipient${n}@example.test`
  )
  await page.goto(`/managed-portfolio-${n}/edit`)
  await expect(page.getByLabel('Full name')).toHaveValue('Creative Managed')
  expect((await page.goto('/admin/portfolios'))?.status()).toBe(404)
  await visitor.close()
})
