# Lib catalog

The profiles entry point exports assistantTaskSchema, writingSource, writingProposal and publicChatSources. Focused proposals preserve unrelated records and reject changed numeric/URL facts; public source links derive from the permitted projection. Feedback metadata remains optional for legacy proposal compatibility.

Validation, Supabase helpers, and shared types for `@shared/lib`. Domain services and repositories live in `@shared/services`. Import a specific entry point. Authorization stays in the app feature that calls these modules.

| Export                          | Path                                | Use                                                       |
| ------------------------------- | ----------------------------------- | --------------------------------------------------------- |
| `@shared/lib/profile`           | `src/domain/profile.ts`             | Profile schema and validation                             |
| `@shared/lib/profiles`          | `src/domain/username.ts`            | Username schema and paths                                 |
| `@shared/lib/section`           | `src/domain/section.ts`             | Section schema                                            |
| `@shared/lib/section-templates` | `src/domain/section-templates.ts`   | Template import and export                                |
| `@shared/lib/pageforge-import`  | `src/domain/pageforge-import.ts`    | PageForge conversion                                      |
| `@shared/lib/cv-import`         | `src/domain/cv-import.ts`           | Reviewed CV import                                        |
| `@shared/lib/cv-file`           | `src/domain/cv-file.ts`             | Upload size and type checks                               |
| `@shared/lib/profiles`          | `src/domain/ai-edit.ts`             | Edit proposal validation                                  |
| `@shared/lib/profiles`          | `src/domain/google-profile.ts`      | Google profile review                                     |
| `@shared/lib/profiles`          | `src/domain/portfolio-knowledge.ts` | Public and owner assistant context                        |
| `@shared/lib/supabase`          | `src/supabase`                      | Typed Supabase clients (`Database` schema)                |
| `@shared/lib/types`             | `src/types`                         | Shared database and chat types (`Database`, `Json`, rows) |
| `@shared/lib/errors`            | `src/errors`                        | Generic request errors                                    |
| `@shared/lib/utils`             | `src/utils`                         | Date and other domain helpers                             |
| `@shared/lib/date`              | `src/date`                          | Shared date helpers                                       |
| `@shared/lib/cache`             | `src/cache`                         | Service worker cache manager                              |

Generated Supabase schema lives in `src/types/supabase/database.types.ts` and is exported through `@shared/lib/types` only.
