# Config catalog

projectPublicProfile builds independent website/CV data projections; contactFields and OutputFields define structured contact exclusions. The public storage boundary is still under construction in PR84.

portfolioTemplates and applyPortfolioTemplate configure profession compositions without copying sample facts or altering privacy/PDF settings. cvLayouts includes ATS-friendly and ATS-friendly compact.

Profile shape, themes, copy, and section metadata for `@shared/config`. This package does not read a database or authorize a request.

| Export                     | Path            | Use                                                        |
| -------------------------- | --------------- | ---------------------------------------------------------- |
| `@shared/config`           | `src/index.ts`  | Profile, themes, languages, copy, and sections             |
| `@shared/config/variables` | `src/variables` | Shared variables                                           |
| `@shared/config/urls`      | `src/urls`      | App API paths, Trello proxy/API paths, external fetch URLs |
| `@shared/config/sections`  | `src/sections`  | Section metadata without the rest of the package           |

| Area                                     | Use                                             |
| ---------------------------------------- | ----------------------------------------------- |
| `profile`, `PortfolioProfile`            | Default profile and the persisted profile shape |
| `copy`                                   | Site, chat, CV, and error copy                  |
| `languages`, `getPortfolioCopy`          | Portfolio and CV labels                         |
| `portfolioTypes`, `cvLayouts`            | Layout and PDF format choices                   |
| `portfolioThemes`, `portfolioAccents`    | Theme palettes and preview accents              |
| `authorableSections`                     | Section families an owner can add               |
| `sectionRegistry`, `sectionCompositions` | Built-in section order and compositions         |
| `section-templates` types                | Saved and exported section template shapes      |
