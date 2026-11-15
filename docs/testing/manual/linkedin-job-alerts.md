# LinkedIn job-alert imports

**Scope/status:** Private forwarding addresses, review inbox, saving and CV matching. Hosted email delivery is pending relay configuration and verification.

**Prerequisites:** Apply the Job Hunter and LinkedIn alert migrations in staging. Sign in with a disposable confirmed account using the same email address as the LinkedIn account. Configure the relay below and use fictional CV details when testing.

## Configure forwarding

1. Point an inbound mail subdomain at your relay. Route recipients matching `alerts+<uuid>@<subdomain>` to the app. Preserve the SMTP envelope recipient, including its plus suffix.
2. Set `JOB_ALERT_DOMAIN` to the inbound subdomain and `JOB_ALERT_RELAY_SECRET` to a randomly generated secret of at least 32 characters in the app’s server environment. Configure the same secret in the relay.
3. Have the relay decode the MIME email, discard attachments, and post to `/api/jobs/linkedin` with `Authorization: Bearer <secret>` and the JSON below. Supply `verifiedSender` only from an authenticated sender or a forwarding account the relay has verified. A parsed From header or the original LinkedIn sender does not identify the forwarding account. Retry a 503 with backoff.
4. On LinkedIn, turn on the desired job alert and enable email. Forward an alert from the same email you use in MyDevStudio. Automatic forwarding depends on the email provider and relay. Some providers require an address confirmation, and some rules preserve LinkedIn as the original sender. Configure confirmation and verified account binding at the relay before enabling automatic forwarding.

```json
{
  "recipient": "alerts+4f98492f-e7f9-4e11-bcaa-b045e32d8240@jobs.example.test",
  "verifiedSender": "owner@example.test",
  "text": "Engineer: https://www.linkedin.com/jobs/view/123/",
  "html": ""
}
```

The relay sends the verified forwarding account address, which the app checks against the current confirmed MyDevStudio email. The app extracts direct LinkedIn job links and available anchor titles. It discards the email body after extraction. The original job URL opens in the user's browser. A reviewed job can be saved without a score when requirements, CV evidence, or AI service are unavailable.

## Manual checks

| Step | Clickable URL                                  | Route path    | Action                                                                                                      | Expected result                                                                      | Actual result / evidence |
| ---- | ---------------------------------------------- | ------------- | ----------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ | ------------------------ |
| 1    | [Job Hunter](http://localhost:3000/admin/jobs) | `/admin/jobs` | Open **LinkedIn alerts** and choose **Create forwarding address**.                                          | A private forwarding address appears.                                                | Not run                  |
| 2    | [Job Hunter](http://localhost:3000/admin/jobs) | `/admin/jobs` | Forward the same alert twice and choose **Check for alerts**.                                               | Each extracted LinkedIn job ID appears once.                                         | Not run                  |
| 3    | [Job Hunter](http://localhost:3000/admin/jobs) | `/admin/jobs` | Edit the listing fields, enter requirements and choose **Save and match**.                                  | The job moves into Saved and shows a score when CV matching succeeds.                | Not run                  |
| 4    | [Job Hunter](http://localhost:3000/admin/jobs) | `/admin/jobs` | Sign in as a second account, forward to the first address from the second email, and inspect both accounts. | The second account sees its own inbox. The mismatched sender creates no pending job. | Not run                  |
| 5    | [Job Hunter](http://localhost:3000/admin/jobs) | `/admin/jobs` | Choose **Disable forwarding** and deliver an alert to the old address.                                      | No new import appears. Previously received jobs can still be reviewed.               | Not run                  |

Automated coverage uses fictional relay requests and disposable PostgreSQL fixtures.
