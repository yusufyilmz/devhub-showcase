import { expect, test } from '@playwright/test'

for (const type of ['designer', 'consultant', 'minimal']) {
  test(`${type} portfolio renders its content and downloads a CV`, async ({
    page
  }, testInfo) => {
    const response = await page.goto(`/${type}-example`)
    expect(response?.status()).toBe(200)
    await expect(page.locator('[data-portfolio-type]')).toHaveAttribute(
      'data-portfolio-type',
      type
    )
    await expect(page.getByRole('heading', { level: 1 })).toContainText(
      'Example'
    )
    await expect(page.locator('#work')).toContainText('Yusuf Fitness OS')
    await expect(page.locator('#work')).not.toContainText(
      'Bank Movements Classifier'
    )
    await page.screenshot({
      path: testInfo.outputPath('portfolio.png'),
      fullPage: true
    })
    await page.getByRole('link', { name: /Explore my work/ }).click()
    await expect(page).toHaveURL(new RegExp(`/${type}-example#work$`))
    const pdf = await page.request.get(`/${type}-example/cv.pdf`)
    expect(pdf.headers()['content-type']).toContain('application/pdf')
    expect((await pdf.body()).subarray(0, 5).toString()).toBe('%PDF-')

    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth > innerWidth
      )
    ).toBe(false)
  })
}

test('a new owner chooses a layout, saves it and returns to the editor without losing the choice', async ({
  page,
  context
}, testInfo) => {
  const index = testInfo.project.name.startsWith('mobile') ? 1 : 0
  const device = index ? 'mobile' : 'desktop'
  await page.request.post(`http://127.0.0.1:3101/__test/reset/${device}`)
  const userId = `33333333-3333-4333-8333-33333333333${index}`
  const exp = Math.floor(Date.now() / 1000) + 3600
  // Only the test fixture accepts this synthetic token. No real account or
  // production provider is involved. This does not exercise live Google OAuth.
  const accessToken = [
    Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString(
      'base64url'
    ),
    Buffer.from(
      JSON.stringify({ sub: userId, exp, aud: 'authenticated' })
    ).toString('base64url'),
    Buffer.from('test-signature').toString('base64url')
  ].join('.')
  const session = {
    access_token: accessToken,
    refresh_token: 'fixture-refresh',
    token_type: 'bearer',
    expires_in: 3600,
    expires_at: exp,
    user: { id: userId, email: 'owner@example.test' }
  }
  await context.addCookies([
    {
      name: 'sb-127-auth-token',
      value: `base64-${Buffer.from(JSON.stringify(session)).toString('base64url')}`,
      url: 'http://localhost:3100',
      sameSite: 'Lax'
    }
  ])
  await page.goto(`/${device}-starter/edit`)
  await expect(
    page.getByRole('group', { name: 'Choose your portfolio layout' })
  ).toBeVisible()
  await page.getByRole('radio', { name: /Designer/ }).check()
  await page.screenshot({
    path: testInfo.outputPath('type-picker.png'),
    fullPage: true
  })
  await page.getByRole('button', { name: 'Use this layout' }).click()
  await expect(page.getByLabel('Full name')).toHaveValue('New Portfolio Owner')
  await expect(
    page.getByLabel('Publish my profile and CV at a public link')
  ).not.toBeChecked()
  await page.getByRole('button', { name: 'Save changes' }).click()
  await expect(page.getByRole('status')).toContainText('Saved')
  await page.reload()
  await expect(page.getByLabel('Full name')).toHaveValue('New Portfolio Owner')
  await page.getByRole('button', { name: 'Layout', exact: true }).click()
  await expect(page.getByRole('radio', { name: /Designer/ })).toBeChecked()
  await page.getByRole('button', { name: 'PDF', exact: true }).click()
  await expect(page.getByLabel('CV layout')).toHaveValue('editorial')
  await page.getByRole('button', { name: 'Language settings' }).click()
  await page.getByLabel('Portfolio language').selectOption('es')
  await page.getByLabel('CV language').selectOption('tr')
  await page.getByRole('button', { name: 'Save changes' }).click()
  await expect(page.getByRole('status')).toContainText('Saved')
  await page.reload()
  await expect(page.locator('html')).toHaveAttribute('lang', 'en')
  await page.getByRole('button', { name: 'Language settings' }).click()
  await expect(page.getByLabel('Portfolio language')).toHaveValue('es')
  await expect(page.getByLabel('CV language')).toHaveValue('tr')
  const savedPdf = await page.request.get('/api/admin/cv')
  expect(savedPdf.headers()['content-language']).toBe('tr')
  expect((await savedPdf.body()).subarray(0, 5).toString()).toBe('%PDF-')
})
