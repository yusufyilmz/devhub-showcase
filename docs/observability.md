# Observability

## Decision and implementation status

Use the existing **Pino** logging as the free baseline. Adopt **Sentry Developer** as the recommended hosted error-monitoring option when configuring monitoring for this project. This guide defines the framework and rollout; it does not install a Sentry SDK or provision an account.

| Capability           | Current status                                                 |
| -------------------- | -------------------------------------------------------------- |
| Server logs          | Pino is installed in `packages/log` and `packages/lib/src/log` |
| Log level            | Both entry points honor `LOG_LEVEL`                            |
| Application identity | Both use `APPLICATION_NAME`                                    |

pnpm exec playwright install chromium
| Distributed traces, dashboards and alerts | Proposed below; not active merely by merging this guide |
| Automatic telemetry redaction | Not configured in the existing logger factories; callers must allowlist safe fields |

The two existing logger factories are not identical: `packages/log` includes environment and ISO timestamps, string levels and pretty development output; the lib logger retains Pino defaults. Do not assume one schema across both. Use the entry point already used by the affected package and normalize fields in a separately tested implementation when needed.

## Free service comparison

Checked against vendor information on 30 October 2026. Recheck the linked plan and your account quotas before enabling ingestion.

| Option             | Free basis                                                           | Fit                                                                                 |
| ------------------ | -------------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| Pino               | Existing open-source dependency; no monitoring subscription required | Structured server logs; hosting retention and collection can still cost money       |
| Sentry Developer   | Free plan confirmed by Sentry's help center; usage quotas apply      | Recommended next step for application error triage                                  |
| Grafana Cloud Free | Advertises a free tier including 50 GB monthly log ingestion         | Alternative for broader logs/metrics work; check retention and ingestion-path costs |
| Coralogix          | Pricing advertises a 14-day trial and paid ingestion                 | Do not treat the trial as permanent free monitoring                                 |

Sources: [Sentry Developer plan update](https://www.sentry.help/en/articles/16738709-changes-to-legacy-developer-plans-september-2026), [Sentry quota handling](https://www.sentry.help/en/articles/13964891-i-ve-exhausted-my-quota-what-now), [Sentry pricing](https://sentry.io/pricing/), [Grafana pricing](https://grafana.com/pricing/), [Coralogix pricing](https://www.coralogix.com/pricing/).

Choose the free plan explicitly after any trial. Do not enable paid overages or upgrade automatically. Review usage regularly; when limits are reached, accept reduced monitoring coverage rather than unexpected spend. Free monitoring does not make the app's hosting, AI or database usage free.

## Event contract

Use structured, allowlisted fields. This is the convention for new instrumentation, not a claim that every existing call already follows it.

| Field                    | Meaning                                                    |
| ------------------------ | ---------------------------------------------------------- |
| `event`                  | Stable operation name, such as `profile.save.failed`       |
| `requestId`              | Generated opaque correlation ID; never a session token     |
| `operation`              | Low-cardinality operation name                             |
| `outcome`                | `success`, `rejected` or `failure`                         |
| `durationMs`             | Elapsed time measured with a monotonic clock               |
| `errorCode`              | Sanitized internal code, not a raw provider message        |
| `release`, `environment` | Deployment commit and environment when explicitly supplied |

Use route templates instead of full URLs or usernames. Do not use profile IDs, email addresses or request IDs as metric labels.

For example, with an existing logger instance in scope:

```ts
logger.error(
  {
    errorCode: "PERSISTENCE_UNAVAILABLE",
    event: "profile.save.failed",
    operation: "profile.save",
    outcome: "failure",
  },
  "Profile save failed",
);
```

Use info for meaningful successful operations, warn for actionable degraded behavior, and error for unexpected failures. Avoid logging every render or turning expected validation/conflict responses into exception noise.

## Privacy

Never send authentication headers, cookies, access/refresh tokens, private CV text, uploads, prompts, model responses, contact details or complete request/response bodies to telemetry. Raw error messages and URLs can contain those values too.

Allowlist context at the call site. Before adopting a collector or SDK, add tested redaction/scrubbing and inspect actual outgoing events. Default Pino logging and disabling default PII in an error tracker are not comprehensive redaction.

Keep session replay, screenshots, request-body capture, AI payload capture and profiling disabled initially. Limit access and retention. Treat traces, screenshots and exported logs as potentially sensitive artifacts.

## Sentry rollout checklist

This is pending implementation and configuration:

1. Create a project on the free Developer plan and verify its current user and ingestion limits.
2. Follow the [official Next.js setup](https://docs.sentry.io/platforms/javascript/guides/nextjs/) for a compatible SDK. Pin it in the workspace catalog, use `catalog:` in the app manifest and regenerate the lockfile.
3. Add browser/server/runtime instrumentation and error-boundary handling appropriate to the installed Next.js version. Keep a missing DSN safe for local runs, CI and builds.
4. Supply DSN, environment and release configuration through the deployment environment. If source-map upload is enabled, keep its auth token in build secrets only. A public DSN is not an auth token.
5. Disable default PII, replay and profiling. Scrub request metadata, breadcrumbs, exception text and custom context before sending. Initially disable tracing; enable low sampling only after measuring error-monitoring usage.
6. Capture unexpected failures once at a suitable boundary. Preserve expected validation and access-denial responses without noisy exception reporting.
7. In an isolated test environment, trigger a synthetic client and server failure, inspect the received events for sensitive fields, confirm release/source-map behavior and verify a missing/invalid configuration cannot break app responses.
8. Configure the alerts below only after validating event delivery. Verify notification delivery using a synthetic event and remove temporary failure routes.

Completion means an event and alert were actually observed, not just that a DSN exists. Recheck limits after rollout and keep local/test events out of production quotas.

## Signals and initial alert proposals

These are starting thresholds to tune after collecting a baseline, not installed alerts or promised service levels.

| Signal                        | Initial rule                                                    | Response                                                              |
| ----------------------------- | --------------------------------------------------------------- | --------------------------------------------------------------------- |
| Unexpected application errors | New production error, grouped by release                        | Inspect scope and compare to the latest change                        |
| Save/PDF failures             | At least 5 failures and over 5% failure rate in 10 minutes      | Check persistence/PDF dependencies and recent deployment              |
| Slow save/PDF operations      | p95 above 2 seconds for 15 minutes, with at least 20 operations | Compare dependency latency and workload                               |
| AI dependency failures        | At least 5 unexpected provider failures in 10 minutes           | Check provider status, configuration and limits; never attach prompts |
| Telemetry usage               | 80% of the free monthly allowance                               | Reduce noisy events/sampling and inspect unexpected volume            |

Use separate environments and deployment release IDs. Deduplicate alerts and notify the maintainer through configured channels. Do not create alerts until the underlying event/metric instrumentation exists. Rate-limit rejections should be tracked separately from provider outages.

## Incident workflow

1. Establish the affected operation, environment, release and time window.
2. Correlate sanitized events by request ID. Compare failures with recent deployments and provider status.
3. Reproduce with synthetic data. For suspected data exposure, follow [SECURITY.md](../SECURITY.md).
4. Fix or roll back through the normal reviewed deployment process, then validate the user flow.
5. Confirm the error rate has recovered and document the cause, impact and follow-up.

Keep incident evidence restricted. Public issues and PRs should contain sanitized summaries, not private logs. A lack of events can mean quota exhaustion or broken telemetry; it does not prove the application is healthy.
