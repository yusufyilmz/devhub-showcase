const { resolve } = require('node:path');
 
const project = resolve(process.cwd(), 'tsconfig.json');
 
/*
 * This is a custom ESLint configuration for use with
 * Next.js apps.
 *
 * This config extends the Vercel Engineering Style Guide.
 * For more information, see https://github.com/vercel/style-guide
 *
 */
 
module.exports = {
  extends: [
    "next/typescript",
    ...[
      require.resolve('@vercel/style-guide/eslint/node'),
      require.resolve('@vercel/style-guide/eslint/typescript'),
      require.resolve('@vercel/style-guide/eslint/browser'),
      require.resolve('@vercel/style-guide/eslint/react'),
      require.resolve('@vercel/style-guide/eslint/next'),
      // Turborepo custom eslint configuration configures the following rules:
      //  - https://github.com/vercel/turborepo/blob/main/packages/eslint-plugin-turbo/docs/rules/no-undeclared-env-vars.md
      'eslint-config-turbo',
    ].map(require.resolve),
    'prettier',
    'eslint:recommended',
    "turbo",
    "eslint-config-prettier"
  ],
  parserOptions: {
    project,
  },
  globals: {
    React: true,
    JSX: true,
  },
  env: {
    node: true,
    browser: true,
  },
  plugins: ["only-warn"],
  settings: {
    'import/resolver': {
      typescript: {
        project,
      },
    },
  },
  ignorePatterns: ['node_modules/', 'dist/', ".*.js"],
  rules: {
    'import/no-default-export': 'off',
    "import/no-named-as-default": "off",
    'react/prop-types': 'off',
  },
  overrides: [
    { files: ["*.js?(x)", "*.ts?(x)"] },
    {
      files: ['*.ts', '*.tsx'],
      rules: {
        'react/prop-types': 'off',
      },
    },
  ]
};
