const fs = require('fs')
const path = require('path')

const packageName = process.argv[2]

if (!packageName) {
  console.error('Please provide a package name.')
  process.exit(1)
}

const packagePath = path.join(__dirname, 'packages', packageName)
const srcPath = path.join(packagePath, 'src')

// Create package folder
if (!fs.existsSync(packagePath)) {
  fs.mkdirSync(packagePath, { recursive: true })
}

// Create src folder
if (!fs.existsSync(srcPath)) {
  fs.mkdirSync(srcPath, { recursive: true })
}

// Create package.json
const packageJson = {
  name: `@freelance-projects/${packageName}`,
  version: '1.0.0',
  main: 'src/index.ts',
  scripts: {
    build: 'tsc',
    dev: 'tsc --watch'
  },
  dependencies: {},
  devDependencies: {
    typescript: '^4.0.0'
  }
}

fs.writeFileSync(
  path.join(packagePath, 'package.json'),
  JSON.stringify(packageJson, null, 2)
)

// Create index.ts
fs.writeFileSync(
  path.join(srcPath, 'index.ts'),
  `export const greet = (name: string) => {
    return \`Hello, \${name}!\`;
};`
)

console.log(`Package @freelance-projects/${packageName} created successfully!`)
