import type { PlopTypes } from "@turbo/gen";

export default function generator(plop: PlopTypes.NodePlopAPI): void {
  plop.setGenerator("react-component", {
    actions: [
      {
        path: "src/{{kebabCase name}}.tsx",
        templateFile: "templates/component.hbs",
        type: "add",
      },
      {
        path: "package.json",
        pattern: /"exports": {(?<insertion>)/g,
        template: '    "./{{kebabCase name}}": "./src/{{kebabCase name}}.tsx",',
        type: "append",
      },
    ],
    description: "Adds a new react component",
    prompts: [
      {
        message: "What is the name of the component?",
        name: "name",
        type: "input",
      },
    ],
  });
}
