# Import ChatGPT job research into Job Hunter

**Scope/status:** Local paste-and-review import. Automatic delivery is not available. Apply `supabase/migrations/20261121033000_chatgpt_job_import_reports.sql` on a disposable database before checking report history. Do not apply it to production from this change. Set `JOBS_CHATGPT_IMPORT=false` to hide the importer without deleting saved research.

**Prerequisites:** A confirmed disposable account, the Job Hunter tables, and the import-report migration. Redis is required on Preview and Production; without it those deployments refuse new imports. Local development without Redis still accepts a paste. Use fictional companies and public example URLs. Do not paste recruiter addresses, private email, or live candidate data.

**Manual result:** Not run. Record the preview URL, commit, tester, date and safe evidence when executing.

| Step | Clickable URL                                               | Route path     | Action                                                                                                                                                 | Expected result                                                                                                                             | Actual result / evidence |
| ---- | ----------------------------------------------------------- | -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------ |
| 1    | [Open Job Hunter](http://localhost:3001/studio/jobs)        | `/studio/jobs` | Sign in, open **Import ChatGPT research report**, paste a fictional `schemaVersion: 1` report with one public HTTPS job, and click **Preview report**. | The preview lists **ChatGPT research · unverified**, the original link, unknown or unverified salary, and does not add a Discover card yet. | Not run                  |
| 2    | [Confirm the import](http://localhost:3001/studio/jobs)     | `/studio/jobs` | Click **Confirm import**, then reload Discover.                                                                                                        | The role appears as unverified research with a local import time. It is unscored. No application is created and no browser alert is sent.   | Not run                  |
| 3    | [Repeat the same report](http://localhost:3001/studio/jobs) | `/studio/jobs` | Preview and confirm the same URL again, including a tracking parameter such as `utm_source`.                                                           | The preview says **already imported**. Confirm adds no second card and no alert. Import history shows another row with zero new jobs.       | Not run                  |
| 4    | [Reject a bad report](http://localhost:3001/studio/jobs)    | `/studio/jobs` | Preview six jobs, a `javascript:` URL, and a report that adds `recruiterEmail`.                                                                        | The request is rejected with a field path. The response does not echo the rejected address. Saved jobs stay unchanged.                      | Not run                  |
| 5    | [Check another account](http://localhost:3001/studio/jobs)  | `/studio/jobs` | Sign in as a second confirmed account and open Job Hunter. Then sign out and open the same URL.                                                        | The second account does not see the first account's imports. A signed-out visitor is sent to login.                                         | Not run                  |
| 6    | [Hide the importer](http://localhost:3001/studio/jobs)      | `/studio/jobs` | Set `JOBS_CHATGPT_IMPORT=false`, restart the app, and reload Job Hunter.                                                                               | The import form is gone. Previously imported cards remain.                                                                                  | Not run                  |

## Contract

ChatGPT's consumer scheduled tasks deliver a chat result. OpenAI's help center documents event triggers for Gmail, Slack and GitHub only, and personal data exports do not include scheduled-task output ([Scheduled tasks in ChatGPT](https://help.openai.com/en/articles/10291617-scheduled-tasks-in-chatgpt)). The Agents API can schedule its own sessions ([Scheduled automations](https://developers.openai.com/api/docs/guides/agents-api/sessions/automations)), which is a different product and would require an API key. V1 does not call either one. The supported path is a person copying the JSON below.

Imported rows use the existing `job_listings` and `job_matches` tables. `source` is `chatgpt_research`, match `state` stays `new`, `score` stays null, and `notified_at` stays null until a later reviewed action. There is no staging table: pending review is the existing Discover state. A separate `job_import_reports` row records the title, summary, counts and time, including a report with zero jobs. The raw paste is not stored.

Identity is the signed-in user plus a hash of the canonical HTTPS URL. Tracking parameters (`utm_*`, `fbclid`, `gclid`, `mc_cid`, `mc_eid`) are removed and the remaining query parameters are sorted, so the same posting dedupes. Other parameters, including provider job ids, stay in the URL. Two different URLs at the same company stay two jobs. The report has no separate provider id field because the research payload does not supply one that is independent of the URL.

The body limit is 20,000 characters and at most five jobs. With Redis configured, one account can import 20 reports an hour and the app accepts 500 a day. A Redis failure or a hosted deployment without Redis refuses the import. `JOBS_CHATGPT_IMPORT=false` returns 404 from `POST /api/jobs/import-chatgpt` and hides the form.

Validation errors name the field path and a short message. They do not return the rejected value. Unsupported fields, including recruiter contact fields, are rejected. The server does not fetch the supplied URL. Import does not score a CV, create an application, or send a push alert. Saving, dismissing, opening the external site, and preparing a CV remain the existing Job Hunter actions and happen only after review.

## User flow

1. Sign into MyDevStudio and visit `/studio/jobs`.
2. Open **Import ChatGPT research report**.
3. Paste a JSON report with the exact format below. It must contain no more than five jobs. An empty `jobs` array is allowed.
4. Select **Preview report** to validate the JSON without changing saved data. Review the reported candidates, duplicate indicators and unknown fields.
5. Select **Confirm import**. The page refreshes; review imported items in Discover before saving or applying.
6. The app marks these items as **unverified ChatGPT research**. Always independently check whether the position is active, location eligibility and salary.

```json
{
  "schemaVersion": 1,
  "report": {
    "generatedAt": "2026-11-19T19:00:00Z",
    "source": "chatgpt_automation",
    "automationTitle": "Birleşik Kariyer ve İş Fırsatları",
    "summary": "Bu kontrolde bir uygun ilan bulundu."
  },
  "jobs": [
    {
      "title": "Senior Frontend Engineer",
      "company": "Example Company",
      "originalUrl": "https://example.com/careers/frontend",
      "location": "Spain",
      "workModel": "remote",
      "spainEligible": null,
      "postedAt": null,
      "salaryMin": null,
      "salaryMax": null,
      "salaryCurrency": null,
      "matchReason": "React and TypeScript match the profile."
    }
  ]
}
```

The example is **fictional**. Do not import it as a genuine opportunity.

## Automation output instruction (after release approval)

Append to the existing ChatGPT `Birleşik Kariyer ve İş Fırsatları` task instructions:

> Continue reporting in Turkish on every run, even with zero matches. At the end of the report, include one fenced `json` block conforming to `schemaVersion: 1` with report metadata and at most five verified candidate links. Use `source: "chatgpt_automation"`, current ISO timestamp, the automation title and a concise summary. Include title, company and direct public HTTPS job URL for each candidate. Optional fields: location, workModel (remote/hybrid/onsite/unknown), spainEligible (true/false/null), postedAt (ISO timestamp or null), salaryMin/salaryMax (numbers or null), salaryCurrency (three-letter code or null), matchReason, evidenceUrl (public HTTPS). Never invent unknown dates, eligibility, salary or evidence. Do not include recruiter email addresses, contact details or private email bodies. Return `jobs: []` when none qualify. Do not claim the JSON was sent to MyDevStudio; it must be copied and imported manually.

## Security and limitations

- Protected endpoint: `POST /api/jobs/import-chatgpt`, requiring a signed-in workspace and same-origin request.
- The `schemaVersion` and job fields are strictly validated; body size is limited to 20,000 characters.
- Only public HTTPS outbound job URLs are accepted; the server does **not** fetch supplied URLs.
- The server determines the account from authentication, never the JSON.
- URL tracking parameters are stripped for deduplication; two imports of the same job cannot create duplicate matches.
- Imported items remain unscored pending review, and no applications or push alerts are generated by the importer.
- Each confirmed report, including an empty one, adds a `job_import_reports` row with the title, summary and counts. Recruiter-message bodies are not stored.
- Source of record for roles remains the existing Job Hunter `job_listings` / `job_matches` tables.
- Run the unit, API route, Supabase RLS and desktop/mobile E2E suites in staging before rollout.

## Existing references

- [Job Hunter manual verification](job-hunter.md)
- [LinkedIn alert forwarding](linkedin-job-alerts.md)
- [Implementation plan](../../../.agents/plans/2026-11-19-chatgpt-job-hunter-import.md)
