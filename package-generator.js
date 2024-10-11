module.exports = function (plop) {
    plop.setGenerator('package', {
      description: 'Create a new package',
      prompts: [
        {
          type: 'input',
          name: 'packageName',
          message: 'Package name?',
        },
      ],
      actions: [
        {
          type: 'add',
          path: 'packages/{{kebabCase packageName}}/package.json',
          templateFile: 'plop-templates/package.json.hbs',
        },
        {
          type: 'add',
          path: 'packages/{{kebabCase packageName}}/src/index.ts',
          templateFile: 'plop-templates/index.ts.hbs',
        },
      ],
    });
  };
  