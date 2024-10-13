const { resolve } = require("node:path");

const project = resolve(process.cwd(), "tsconfig.json");

/*
 * This is a custom ESLint configuration for use with
 * internal (bundled by their consumer) libraries
 * that utilize React.
 */

/** @type {import("eslint").Linter.Config} */
module.exports = {
  extends: [
    "eslint:recommended", 
    "prettier",
    "turbo",
    "plugin:@typescript-eslint/recommended", 
    "plugin:@typescript-eslint/eslint-recommended", 
    "plugin:react/recommended",
    "eslint-config-prettier",
    "eslint-config-turbo"
  ],
  plugins: ["only-warn"],
  globals: {
    React: true,
    JSX: true,
  },
  env: {
    browser: true,
  },
  plugins: ["only-warn"],
  settings: {
    "import/resolver": {
      typescript: {
        project,
      },
    },
  },
  ignorePatterns: [
    ".*.js",
    "node_modules/",
    "dist/",
  ],
  rules: {
    "import/no-default-export": "off",
    "import/no-named-as-default": "off",
    "react/prop-types": "off",
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
