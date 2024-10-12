module.exports = {
  root: true,
  extends: ['@shared/eslint-config/library.js'],
  rules: {
    '@next/next/no-html-link-for-pages': 'off'
  },
  parserOptions: {
    project: './tsconfig.json',
    tsconfigRootDir: __dirname
  }
}
