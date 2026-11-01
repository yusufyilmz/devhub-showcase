# CV catalog

PDF rendering for `@shared/cv`. The caller supplies the profile and decides who may download it.

| Export                    | Path                    | Use                                     |
| ------------------------- | ----------------------- | --------------------------------------- |
| `@shared/cv`              | `src/index.ts`          | CV data, pdfmake definition, and render |
| `@shared/cv/template.hbs` | `templates/cv.json.hbs` | Handlebars template source              |

| Symbol               | Use                                         |
| -------------------- | ------------------------------------------- |
| `createCvData`       | Profile fields prepared for the template    |
| `createCvDefinition` | pdfmake document definition                 |
| `renderCv`           | PDF bytes                                   |
| `cvHelpers`          | Handlebars helpers shared with the template |
