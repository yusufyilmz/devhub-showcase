import type { PlopTypes } from "@turbo/gen";

export default function generator(plop: PlopTypes.NodePlopAPI): void {
  plop.setGenerator("create-package", {
    description: "Generates a new package in the monorepo",
    prompts: [
      {
        type: "input",
        name: "packageName",
        message: "What is the name of your package?",
      },
    ],
    actions: [
      {
        type: "add",
        path: "packages/{{dashCase packageName}}/package.json",
        templateFile: "templates/package/package.json.hbs",
      },
      {
        type: "add",
        path: "packages/{{dashCase packageName}}/src/index.ts",
        templateFile: "templates/package/index.ts.hbs",
      },
      {
        type: "add",
        path: "packages/{{dashCase packageName}}/README.md",
        templateFile: "templates/package/README.md.hbs",
      },
    ],
  });
  plop.setGenerator("create-component", {
    description: "Adds a new react component",
    prompts: [
      {
        type: "input",
        name: "name",
        message: "What is the name of the component?",
      },
    ],
    actions: [
      {
        type: "add",
        path: "packages/ui/src/components/{{kebabCase name}}.tsx",
        templateFile: "templates/component/component.hbs",
      },
      {
        type: "append",
        path: "package.json",
        pattern: /"exports": {(?<insertion>)/g,
        template: '    "./{{kebabCase name}}": "./src/{{kebabCase name}}.tsx",',
      },
    ],
  });
}
