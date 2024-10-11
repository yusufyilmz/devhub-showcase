/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,
  extends: ['@shared/eslint-config/react-internal.js'],
  parser: '@typescript-eslint/parser',
  ignorePatterns: ['postcss.config.js', 'tailwind.config.js'],
  parserOptions: {
    project: './tsconfig.lint.json',
    tsconfigRootDir: __dirname
  }
}
