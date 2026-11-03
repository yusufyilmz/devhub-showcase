# CV catalog

renderCv accepts an optional fourth argument with a validated CV section order for private version exports. Header/contact text stays first; layout and content inclusion rules remain independent.

ATS-friendly and ATS-friendly compact use a linear text-only reading order with visible URLs and the existing inclusion settings. See docs/testing/portfolio-presentation.md for verification and limitations.

PDF rendering for `@shared/templates`. The caller supplies the profile and decides who may download it.

| Export                           | Path                    | Use                                     |
| -------------------------------- | ----------------------- | --------------------------------------- |
| `@shared/templates`              | `src/index.ts`          | CV data, pdfmake definition, and render |
| `@shared/templates/template.hbs` | `templates/cv.json.hbs` | Handlebars template source              |

| Symbol               | Use                                         |
| -------------------- | ------------------------------------------- |
| `createCvData`       | Profile fields prepared for the template    |
| `createCvDefinition` | pdfmake document definition                 |
| `renderCv`           | PDF bytes                                   |
| `cvHelpers`          | Handlebars helpers shared with the template |
