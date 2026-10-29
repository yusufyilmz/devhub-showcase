import { existsSync } from 'node:fs'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { cvHelpers, renderCv } from '@shared/cv'
import type { PlopTypes } from '@turbo/gen'
import {
  readPublicProfile,
  readPublishedProfile
} from '../../packages/lib/src/services/published-profile'

export default function generator(plop: PlopTypes.NodePlopAPI): void {
  for (const [name, helper] of Object.entries(cvHelpers))
    plop.setHelper(name, helper)
  plop.setGenerator('cv', {
    description:
      'Generate a PDF CV from the published database profile and shared Handlebars template',
    prompts: [
      {
        type: 'input',
        name: 'output',
        message: 'Output PDF path',
        default: 'output/cv.pdf'
      },
      {
        type: 'input',
        name: 'profileId',
        message: 'Public profile ID (main for site owner)',
        default: 'main'
      }
    ],
    actions: [
      async (answers) => {
        for (const file of ['apps/web/.env.local', '.env.local']) {
          if (existsSync(file)) process.loadEnvFile(file)
        }
        const snapshot = await cvSnapshot(answers?.profileId)
        const { profile, revision } = snapshot
        if (revision === 0)
          console.warn(
            'No database configured; generating from the bundled development profile.'
          )
        const template = await readFile(
          resolve('packages/cv/templates/cv.json.hbs'),
          'utf8'
        )
        const pdf = await renderCv(profile, template, (source, data) =>
          plop.renderString(source, data)
        )
        const output = resolve(String(answers?.output || 'output/cv.pdf'))
        if (!output.toLowerCase().endsWith('.pdf'))
          throw new Error('Choose a .pdf output path')
        if (existsSync(output))
          throw new Error(
            `File already exists: ${output}. Choose a new output path.`
          )
        await mkdir(dirname(output), { recursive: true })
        await writeFile(output, pdf, { flag: 'wx' })
        return `Generated ${output} from profile revision ${revision}`
      }
    ]
  })
  plop.setGenerator('create-package', {
    description: 'Generates a new package in the monorepo',
    prompts: [
      {
        type: 'input',
        name: 'packageName',
        message: 'What is the name of your package?'
      }
    ],
    actions: [
      {
        type: 'add',
        path: 'packages/{{dashCase packageName}}/package.json',
        templateFile: 'templates/package/package.json.hbs'
      },
      {
        type: 'add',
        path: 'packages/{{dashCase packageName}}/tsconfig.json',
        templateFile: 'templates/package/tsconfig.json.hbs'
      },
      {
        type: 'add',
        path: 'packages/{{dashCase packageName}}/src/index.ts',
        templateFile: 'templates/package/index.ts.hbs'
      },
      {
        type: 'add',
        path: 'packages/{{dashCase packageName}}/README.md',
        templateFile: 'templates/package/README.md.hbs'
      }
    ]
  })
  plop.setGenerator('create-component', {
    description: 'Adds a new react component',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'What is the name of the component?'
      }
    ],
    actions: [
      {
        type: 'add',
        path: 'packages/ui/src/components/{{kebabCase name}}.tsx',
        templateFile: 'templates/component/component.hbs'
      },
      {
        type: 'append',
        path: 'packages/ui/src/components/index.ts',
        template: "export * from './{{kebabCase name}}'"
      }
    ]
  })
}

async function cvSnapshot(value: unknown) {
  const profileId = String(value || 'main')
  const snapshot =
    profileId === 'main'
      ? await readPublishedProfile()
      : await readPublicProfile(profileId)
  if (!snapshot)
    throw new Error(
      'The requested public profile does not exist or is private.'
    )

  return snapshot
}
