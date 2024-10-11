const { resolve } = require("node:path");

const project = resolve(process.cwd(), "tsconfig.json");

/** @type {import("eslint").Linter.Config} */
module.exports = {
  extends: [
    "eslint:recommended", 
    "prettier", 
    "turbo",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:react/recommended",
  ],
  plugins: [
    "only-warn", 
    "@typescript-eslint"
  ],
  globals: {
    React: true,
    JSX: true,
  },
  env: {
    node: true,
    es6: true,
    browser: true,
  },
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: project,
    sourceType: "module",
    ecmaFeatures: {
      jsx: true,
    },
  },
  settings: {
    "import/resolver": {
      typescript: {
        project,
      },
    },
    react: {
      version: "detect",
    },
  },
  ignorePatterns: [
    ".*.js", // Ignore dotfiles
    "node_modules/",
    "dist/",
  ],
  overrides: [
    {
      files: ["*.ts", "*.tsx"],
      rules: {
        "no-unused-vars": "off", 
        "@typescript-eslint/no-unused-vars": ["error"],
      },
    },
  ],
};
