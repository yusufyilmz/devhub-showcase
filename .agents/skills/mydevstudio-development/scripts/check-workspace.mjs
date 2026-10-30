import { existsSync, readFileSync } from 'node:fs'

const root = JSON.parse(readFileSync('package.json', 'utf8'))
const scripts = [
  'check',
  'test',
  'test:e2e',
  'build',
  'format',
  'lint:fix',
  'typecheck'
]
const paths = [
  'apps/web/package.json',
  'packages/content/package.json',
  'packages/lib/package.json',
  'packages/components/package.json',
  'packages/sections/package.json',
  'packages/auth/package.json',
  'packages/cv/package.json',
  'pnpm-workspace.yaml',
  'playwright.config.ts',
  '.github/workflows/ci.yml'
]
const missing = [
  ...scripts
    .filter((name) => !root.scripts[name])
    .map((name) => `script ${name}`),
  ...paths.filter((path) => !existsSync(path))
]
if (missing.length)
  throw new Error(`Workspace assumptions changed: ${missing.join(', ')}`)
console.log(
  `Workspace verified. Use ${root.packageManager}; Node ${root.engines.node}. Read manifests for current commands.`
)
