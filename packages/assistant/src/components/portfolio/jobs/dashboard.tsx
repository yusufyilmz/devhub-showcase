"use client";

import "./jobs.css";

import { useState } from "react";

import { Button } from "@shared/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@shared/ui/cards";
import { Input } from "@shared/ui/input";
import { Label } from "@shared/ui/label";
import { NativeSelect } from "@shared/ui/native-select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@shared/ui/tabs";
import { Textarea } from "@shared/ui/textarea";

import { SearchForm } from "./search-form";
import type { Draft, JobsData, Match, RunJobAction } from "./types";

type Props = {
  data: JobsData;
  busy: boolean;
  feedback: string;
  run: RunJobAction;
  baseCvUrl: string;
  cvUrl: (id: string) => string;
  push: ((enabled: boolean) => void) | null;
  statuses: readonly string[];
};
const date = (value: string) => new Date(value).toLocaleString();
function ListingSource({ source }: { source: string }) {
  if (source === "adzuna") {
    return (
      <Button
        className="job-hunter-source"
        href="https://www.adzuna.co.uk/"
        rel="noopener noreferrer"
        target="_blank"
        variant="link"
      >
        Adzuna
      </Button>
    );
  }
  return (
    <Button href="https://jooble.org/" rel="noopener noreferrer" target="_blank" variant="link">
      Jooble
    </Button>
  );
}

function MatchCard({ job, busy, run }: { job: Match; busy: boolean; run: RunJobAction }) {
  const { id, listing, explanation, score, state } = job;
  return (
    <Card>
      <CardHeader>
        <CardTitle>{listing.title}</CardTitle>
        <CardDescription>
          {[listing.company, listing.location, `${score}% match`].filter(Boolean).join(" · ")}
        </CardDescription>
      </CardHeader>
      <CardContent className="job-hunter-stack">
        <ListingSource source={listing.source} />
        {listing.minimum !== null || listing.maximum !== null ? (
          <p>
            {listing.minimum?.toLocaleString() ?? "—"} to {listing.maximum?.toLocaleString() ?? "—"}{" "}
            {listing.currency}
          </p>
        ) : null}
        {listing.date && (
          <p>
            {listing.dateKind === "posted" ? "Posted" : "Updated"} {date(listing.date)}
          </p>
        )}
        <p>{explanation.reason}</p>
        <details>
          <summary>Job details and CV match</summary>
          <p>{listing.description}</p>
          {!!explanation.matchedSkills.length && (
            <p>Matched skills · {explanation.matchedSkills.join(", ")}</p>
          )}
          {!!explanation.missingRequirements.length && (
            <p>Missing evidence · {explanation.missingRequirements.join(", ")}</p>
          )}
        </details>
        <div className="job-hunter-actions">
          <Button disabled={busy} onClick={() => run({ action: "open", id })}>
            Open application site
          </Button>
          <Button disabled={busy} onClick={() => run({ action: "draft", id })} variant="outline">
            Prepare with CV
          </Button>
          <Button
            disabled={busy}
            onClick={() => run({ action: "state", id, state: state === "saved" ? "new" : "saved" })}
            variant="outline"
          >
            {state === "saved" ? "Unsave" : "Save job"}
          </Button>
          <Button
            disabled={busy}
            onClick={() =>
              run({ action: "state", id, state: state === "dismissed" ? "new" : "dismissed" })
            }
            variant="outline"
          >
            {state === "dismissed" ? "Restore" : "Dismiss"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function DraftEditor({
  id,
  draft,
  cvUrl,
  busy,
  run,
}: {
  id: string;
  draft: Draft;
  cvUrl: string;
  busy: boolean;
  run: RunJobAction;
}) {
  return (
    <form
      className="job-hunter-stack"
      onSubmit={async (event) => {
        event.preventDefault();
        const fields = new FormData(event.currentTarget);
        const value = (name: string) => String(fields.get(name));
        await run({
          action: "editDraft",
          draft: {
            answers: draft.answers.map(({ question }, index) => ({
              answer: value(`answer-${index}`),
              question,
            })),
            coverLetter: value("letter"),
            summary: value("summary"),
          },
          id,
        });
      }}
    >
      <Label>
        Tailored CV summary
        <Textarea defaultValue={draft.summary} maxLength={650} name="summary" required rows={4} />
      </Label>
      <Label>
        Cover letter
        <Textarea
          defaultValue={draft.coverLetter}
          maxLength={2800}
          name="letter"
          required
          rows={8}
        />
      </Label>
      {draft.answers.map(({ question, answer }, index) => (
        <Label key={question}>
          {question}
          <Textarea defaultValue={answer} maxLength={500} name={`answer-${index}`} rows={3} />
        </Label>
      ))}
      <div className="job-hunter-actions">
        <Button disabled={busy} type="submit">
          Save draft edits
        </Button>
        <Button href={cvUrl} variant="outline">
          Download saved tailored CV PDF
        </Button>
      </div>
    </form>
  );
}

function ApplicationList({
  data,
  statuses,
  cvUrl,
  busy,
  run,
}: Pick<Props, "data" | "statuses" | "cvUrl" | "busy" | "run">) {
  if (!data.applications.length)
    return <p>No applications yet. Open an application site or prepare a draft from Discover.</p>;
  return data.applications.map(({ id, listing, status, draft }) => (
    <Card key={id}>
      <CardHeader>
        <CardTitle>{listing.title}</CardTitle>
        <CardDescription>{listing.company}</CardDescription>
      </CardHeader>
      <CardContent className="job-hunter-stack">
        <ListingSource source={listing.source} />
        <Label>
          Application status
          <NativeSelect
            disabled={busy}
            onChange={(event) => run({ action: "application", id, status: event.target.value })}
            value={status}
          >
            {statuses.map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </NativeSelect>
        </Label>
        <div className="job-hunter-actions">
          <Button disabled={busy} onClick={() => run({ action: "open", id })}>
            Open application site
          </Button>
          {!draft && (
            <Button disabled={busy} onClick={() => run({ action: "draft", id })} variant="outline">
              Prepare with CV
            </Button>
          )}
        </div>
        {draft && (
          <details>
            <summary>Review application draft</summary>
            <DraftEditor
              busy={busy}
              cvUrl={cvUrl(id)}
              draft={draft}
              id={id}
              key={JSON.stringify(draft)}
              run={run}
            />
            <Button disabled={busy} onClick={() => run({ action: "draft", id })} variant="outline">
              Regenerate draft
            </Button>
          </details>
        )}
      </CardContent>
    </Card>
  ));
}

export function JobsDashboard({
  data,
  busy,
  feedback,
  run,
  push,
  statuses,
  baseCvUrl,
  cvUrl,
}: Props) {
  const [query, setQuery] = useState("");
  const [view, setView] = useState("active");
  const active = data.jobs.filter((job) => job.state !== "dismissed");
  const saved = active.filter((job) => job.state === "saved");
  const alerts = active.filter((job) => job.notified_at);
  const discover = (
    view === "alerts"
      ? alerts
      : view === "dismissed"
        ? data.jobs.filter((job) => job.state === "dismissed")
        : active
  )
    .filter(({ listing }) =>
      `${listing.title} ${listing.company} ${listing.location}`
        .toLowerCase()
        .includes(query.trim().toLowerCase()),
    )
    .sort((a, b) => b.score - a.score);

  return (
    <section
      aria-labelledby="job-hunter-title"
      className="job-hunter job-hunter-stack"
      id="admin-content"
    >
      <header>
        <h1 id="job-hunter-title">Job Hunter</h1>
        <p>
          {active.length} visible jobs · {alerts.length} alerts · {data.applications.length} tracked
          applications
        </p>
      </header>
      <p aria-live="polite" role="status">
        {feedback}
      </p>
      <Tabs defaultValue="discover">
        <TabsList aria-label="Job Hunter">
          <TabsTrigger value="discover">Discover</TabsTrigger>
          <TabsTrigger value="saved">Saved</TabsTrigger>
          <TabsTrigger value="applications">Applications</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        <TabsContent className="job-hunter-stack" value="discover">
          <div className="job-hunter-actions">
            <Input
              aria-label="Filter by title, company or location"
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Filter by title, company or location"
              value={query}
            />
            <NativeSelect
              aria-label="Listing view"
              onChange={(event) => setView(event.target.value)}
              value={view}
            >
              <option value="active">All active matches</option>
              <option value="alerts">In-app alerts</option>
              <option value="dismissed">Dismissed</option>
            </NativeSelect>
          </div>
          {!discover.length && (
            <p>No jobs to show. Create and enable a saved search in Settings to start discovery.</p>
          )}
          {discover.map((job) => (
            <MatchCard busy={busy} job={job} key={job.id} run={run} />
          ))}
        </TabsContent>
        <TabsContent className="job-hunter-stack" value="saved">
          {!saved.length && <p>No saved jobs yet.</p>}
          {saved.map((job) => (
            <MatchCard busy={busy} job={job} key={job.id} run={run} />
          ))}
        </TabsContent>
        <TabsContent className="job-hunter-stack" value="applications">
          <Button href={baseCvUrl} variant="outline">
            Download my private CV PDF
          </Button>
          <ApplicationList busy={busy} cvUrl={cvUrl} data={data} run={run} statuses={statuses} />
        </TabsContent>
        <TabsContent className="job-hunter-stack" value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Saved searches</CardTitle>
            </CardHeader>
            <CardContent className="job-hunter-stack">
              <SearchForm busy={busy} run={run} />
              {data.searches.map((search) => (
                <SearchForm
                  busy={busy}
                  key={`${search.id}-${search.due_at}`}
                  run={run}
                  search={search}
                />
              ))}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Browser alerts</CardTitle>
            </CardHeader>
            <CardContent className="job-hunter-actions">
              {push ? (
                <>
                  <Button disabled={busy} onClick={() => push(true)}>
                    Enable on this device
                  </Button>
                  <Button disabled={busy} onClick={() => push(false)} variant="outline">
                    Disable on this device
                  </Button>
                </>
              ) : (
                <p>In-app alerts are available in Discover. Browser push is unavailable.</p>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Scan history</CardTitle>
            </CardHeader>
            <CardContent className="job-hunter-stack">
              {!data.runs.length && <p>No scans have run yet.</p>}
              {data.runs.map((scan) => (
                <div key={scan.id}>
                  <strong>
                    {data.searches.find((search) => search.id === scan.search_id)?.name} ·{" "}
                    {date(scan.created_at)}
                  </strong>
                  <p>
                    {scan.examined} examined · {scan.matched} new matches
                  </p>
                  {scan.issues.map((issue) => (
                    <p key={issue}>{issue}</p>
                  ))}
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </section>
  );
}
