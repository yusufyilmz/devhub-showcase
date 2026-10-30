# CV upload and portfolio drafts

Confirmed users can open Import CV from their own editor or choose Start from a CV during onboarding. Managed portfolio editors use the same draft tool under the signed-in manager's account. Imports never choose an owner, username, publication state, theme, layout, custom section configuration or CV settings.

## Processing

POST /api/admin/cv-import verifies the signed-in user and same-origin request before reading the upload. It bounds the incoming stream, including chunked requests, before parsing multipart data. The application accepts one PDF, DOCX or UTF-8 text CV up to 3 MB. File extensions and signatures are checked; Word files are processed by OpenAI, not unpacked by the app. Old binary DOC files are unsupported. Invalid, unreadable, protected or excessive documents can be rejected by the provider.

CvImportModel in packages/chat uses the existing OpenAI SDK integration, independently of chatbot history. It calls the Responses API with an inline file, strict JSON schema output, store:false, no tools, no automatic retries, a 60 second request timeout and a 12,000 output token ceiling. The default OPENAI_CV_MODEL is gpt-6-luna; configure a compatible file/vision and structured-output model supporting reasoning.effort=none if changing it. The default explicitly disables reasoning for this focused extraction task. This is an extraction service, not a separately trained model. Documents are untrusted data and cannot supply app settings or instructions. Output is validated again with Zod on both server and client.

The original file is not uploaded to Supabase or saved in an account. It is sent to OpenAI after the user selects the consent checkbox and Process CV. store:false disables response application storage; it does not promise zero provider retention. OpenAI's API data policies still apply. Do not log files, request bodies, extracted personal details or upstream errors containing them.

## Limits and configuration

Use the existing server-only OPENAI_API_KEY, REDIS_URL and REDIS_TOKEN. CV import fails closed when credentials or the distributed limiter are unavailable. No key is sent to the client. Authenticated GET /api/admin/cv-import returns only an availability boolean based on configured credentials, not provider health or remaining credits.

The Redis Lua counter is atomic and stores counters only. Each verified account has three attempts per one-hour window. CV_IMPORT_DAILY_LIMIT sets the global 24-hour window cap, default 100. Windows start with the first attempt and expire automatically. Invalid local files do not consume an attempt; a dispatched request can consume an attempt even if it fails or is cancelled. Set provider spending limits as appropriate for the deployment. The function allows up to 90 seconds, including validation and the provider timeout.

## Review, apply and save

The response is an extraction DTO, not a saved profile. Users review editable personal fields, experience, education, projects, skills, languages and About. They select the groups to replace. Empty extracted groups start unselected. Missing personal fields retain current values; missing career fields stay blank. Unknown websites remain absent rather than being invented. Employer and institution links are optional throughout the saved profile model.

Year/month dates use January 1/the first day of the month for the existing date model, with an explicit review note. Missing required dates, degrees, fields or proficiency remain visibly incomplete. Users can correct them in review or after applying; normal profile validation prevents saving an invalid draft. The current education model still requires an end/expected-end date. The service does not infer a current job from an absent end date alone.

Apply replaces only selected groups and generates fresh item IDs. Retained projects are detached from replaced employment records when necessary. Existing item selections and custom source bindings are preserved, so selections referring to replaced IDs may need adjustment in section settings. New projects start hidden from the public projects section; authors decide which to show. Portfolio-only visibility and PDF inclusion continue to follow existing rules.

Cancel or an extraction failure leaves the draft unchanged. Applying updates the current in-memory draft only. Save changes uses the existing revision checks and owner authorization. A private profile stays private until the user explicitly publishes. Saving an already published portfolio updates its public content as usual.

## Homepage and verification

The homepage includes real, fictional-content section renderer previews, the full section catalog, private templates/import-export explanations and a CV onboarding action. Sign-in precedes CV upload.

Unit tests cover file bounds/signatures, schema validation, candidate mapping, missing data, group selection, configuration preservation, API authorization/origin/limits and the provider request contract. Browser tests use a fictional extraction response intercepted in Playwright and a local Supabase transport; they verify review, corrections, cancellation, errors, persistence and explicit publication without paying for model calls. These tests do not prove live provider credentials, quotas or extraction accuracy. Evaluate real outputs with non-sensitive sample CVs after deployment before relying on the import.

Official references: [OpenAI file inputs](https://developers.openai.com/api/docs/guides/file-inputs), [structured outputs](https://developers.openai.com/api/docs/guides/structured-outputs), [API data controls](https://developers.openai.com/api/docs/guides/your-data).
