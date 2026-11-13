"use client";

import "./jobs.css";

import { useState } from "react";

import {
  Bell,
  Bookmark,
  BriefcaseBusiness,
  ExternalLink,
  Search,
  Settings,
  Sparkles,
} from "lucide-react";

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
const date = (value: string) => new Date(value).toLocaleDateString();

function ListingSource({ source }: { source: string }) {
  const adzuna = source === "adzuna";
  return (
    <Button
      className="job-hunter-source"
      href={adzuna ? "https://www.adzuna.co.uk/" : "https://jooble.org/"}
      rel="noopener noreferrer"
      target="_blank"
      variant="link"
    >
      {adzuna ? "Adzuna" : "Jooble"} <ExternalLink aria-hidden="true" />
    </Button>
  );
}

function salary({ minimum, maximum, currency }: Match["listing"]) {
  const range = [minimum, maximum].flatMap((amount) =>
    amount === null ? [] : [amount.toLocaleString()],
  );
  if (!range.length) return "";
  const prefix = minimum === null ? "Up to " : maximum === null ? "From " : "";
  return `${prefix}${[...new Set(range)].join("–")}${currency ? ` ${currency}` : ""}`;
}

function MatchCard({ job, busy, run }: { job: Match; busy: boolean; run: RunJobAction }) {
  const { id, listing, explanation, score, state } = job;
  const isSaved = state === "saved";
  const pay = salary(listing);
  return (
    <Card className="job-hunter-card">
      <CardHeader className="job-hunter-card-heading">
        <div className="job-hunter-role">
          <CardTitle>{listing.title}</CardTitle>
          <CardDescription>
            {[listing.company, listing.location].filter(Boolean).join(" · ")}
          </CardDescription>
        </div>
        <span className="job-hunter-match">
          <Sparkles aria-hidden="true" /> {score}% match
        </span>
      </CardHeader>
      <CardContent className="job-hunter-stack">
        <div className="job-hunter-meta">
          <ListingSource source={listing.source} />
          {pay && <span>{pay}</span>}
          {listing.date && (
            <span>
              {listing.dateKind === "posted" ? "Posted" : "Updated"} {date(listing.date)}
            </span>
          )}
          {isSaved && (
            <span>
              <Bookmark aria-hidden="true" /> Saved
            </span>
          )}
        </div>
        <p className="job-hunter-reason">{explanation.reason}</p>
        <details className="job-hunter-details">
          <summary>Job details and CV match</summary>
          <div className="job-hunter-stack job-hunter-details-body">
            <p className="job-hunter-description">{listing.description}</p>
            {!!explanation.matchedSkills.length && (
              <p>
                <strong>Matched skills</strong> · {explanation.matchedSkills.join(", ")}
              </p>
            )}
            {!!explanation.missingRequirements.length && (
              <p>
                <strong>Missing evidence</strong> · {explanation.missingRequirements.join(", ")}
              </p>
            )}
          </div>
        </details>
        <div className="job-hunter-actions job-hunter-card-actions">
          <Button disabled={busy} onClick={() => run({ action: "open", id })}>
            Open application site <ExternalLink aria-hidden="true" />
          </Button>
          <Button disabled={busy} onClick={() => run({ action: "draft", id })} variant="outline">
            Prepare with CV
          </Button>
          <Button
            disabled={busy}
            onClick={() => run({ action: "state", id, state: isSaved ? "new" : "saved" })}
            variant="ghost"
          >
            <Bookmark aria-hidden="true" /> {isSaved ? "Unsave" : "Save job"}
          </Button>
          <Button
            disabled={busy}
            onClick={() =>
              run({ action: "state", id, state: state === "dismissed" ? "new" : "dismissed" })
            }
            variant="ghost"
          >
            {state === "dismissed" ? "Restore" : "Dismiss"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function EmptyState({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="job-hunter-empty">
      <h3>{title}</h3>
      {children}
    </div>
  );
}

const listingHeadings = {
  active: "Job matches",
  alerts: "In-app alerts",
  dismissed: "Dismissed jobs",
};
type ListingView = keyof typeof listingHeadings;

function DiscoverEmpty({
  hasQuery,
  hasEnabledSearch,
  showActive,
  showSettings,
  view,
}: {
  hasQuery: boolean;
  hasEnabledSearch: boolean;
  showActive: () => void;
  showSettings: () => void;
  view: ListingView;
}) {
  if (hasQuery) {
    return (
      <EmptyState title="No jobs match your search">
        <p>Try a different title, company or location.</p>
      </EmptyState>
    );
  }
  if (view !== "active") {
    return (
      <EmptyState title={view === "alerts" ? "No alerts yet" : "No dismissed jobs"}>
        <Button onClick={showActive} variant="outline">
          View active matches
        </Button>
      </EmptyState>
    );
  }
  return (
    <EmptyState title="No matches yet">
      {hasEnabledSearch ? (
        <p>New matches will appear here after your scheduled searches run.</p>
      ) : (
        <>
          <p>Enable a saved search to start finding matches.</p>
          <Button onClick={showSettings} variant="outline">
            Go to saved searches
          </Button>
        </>
      )}
    </EmptyState>
  );
}

function listingTime({ listing }: Match) {
  return listing.date ? Date.parse(listing.date) || 0 : 0;
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
    return (
      <EmptyState title="No applications yet">
        <p>Open an application site or prepare a draft from Discover.</p>
      </EmptyState>
    );
  return data.applications.map(({ id, listing, status, draft }) => (
    <Card className="job-hunter-card" key={id}>
      <CardHeader>
        <CardTitle>{listing.title}</CardTitle>
        <CardDescription>
          {[listing.company, listing.location].filter(Boolean).join(" · ")}
        </CardDescription>
      </CardHeader>
      <CardContent className="job-hunter-stack">
        <div className="job-hunter-meta">
          <ListingSource source={listing.source} />
        </div>
        <Label className="job-hunter-status-field">
          Application status
          <NativeSelect
            disabled={busy}
            onChange={(event) => run({ action: "application", id, status: event.target.value })}
            value={status}
          >
            {statuses.map((value) => (
              <option key={value} value={value}>
                {value.charAt(0).toUpperCase() + value.slice(1)}
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
          <details className="job-hunter-details">
            <summary>Review application draft</summary>
            <div className="job-hunter-stack job-hunter-details-body">
              <DraftEditor
                busy={busy}
                cvUrl={cvUrl(id)}
                draft={draft}
                id={id}
                key={JSON.stringify(draft)}
                run={run}
              />
              <Button
                disabled={busy}
                onClick={() => run({ action: "draft", id })}
                variant="outline"
              >
                Regenerate draft
              </Button>
            </div>
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
  const [tab, setTab] = useState("discover");
  const [query, setQuery] = useState("");
  const [view, setView] = useState<ListingView>("active");
  const [sort, setSort] = useState("match");
  const active = data.jobs.filter((job) => job.state !== "dismissed");
  const saved = active.filter((job) => job.state === "saved");
  const alerts = active.filter((job) => job.notified_at);
  const dismissed = data.jobs.filter((job) => job.state === "dismissed");
  const listingViews = { active, alerts, dismissed };
  const listings = listingViews[view];
  const terms = query.toLowerCase().trim().split(/\s+/);
  const discover = listings
    .filter(({ listing }) => {
      const searchable = `${listing.title} ${listing.company} ${listing.location}`.toLowerCase();
      return terms.every((term) => searchable.includes(term));
    })
    .sort((a, b) =>
      sort === "recent" ? listingTime(b) - listingTime(a) || b.score - a.score : b.score - a.score,
    );
  const hasQuery = Boolean(query.trim());

  return (
    <section aria-labelledby="job-hunter-title" className="job-hunter" id="admin-content">
      <header className="job-hunter-header">
        <div>
          <h1 id="job-hunter-title">Job Hunter</h1>
          <p>Find roles that fit your CV and track your applications.</p>
        </div>
        {tab !== "settings" && (
          <Button onClick={() => setTab("settings")} variant="outline">
            <Settings aria-hidden="true" /> Manage saved searches
          </Button>
        )}
      </header>
      <p aria-live="polite" className="job-hunter-feedback" role="status">
        {busy ? "Working…" : feedback}
      </p>
      <Tabs className="job-hunter-tabs" onValueChange={setTab} value={tab}>
        <TabsList aria-label="Job Hunter">
          <TabsTrigger value="discover">
            <Search aria-hidden="true" /> Discover <span aria-hidden="true">{active.length}</span>
          </TabsTrigger>
          <TabsTrigger value="saved">
            <Bookmark aria-hidden="true" /> Saved <span aria-hidden="true">{saved.length}</span>
          </TabsTrigger>
          <TabsTrigger value="applications">
            <BriefcaseBusiness aria-hidden="true" /> Applications{" "}
            <span aria-hidden="true">{data.applications.length}</span>
          </TabsTrigger>
          <TabsTrigger value="settings">
            <Settings aria-hidden="true" /> Settings
          </TabsTrigger>
        </TabsList>
        <TabsContent className="job-hunter-stack" value="discover">
          <div className="job-hunter-toolbar">
            <Label>
              Search jobs
              <Input
                aria-label="Filter by title, company or location"
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Title, company or location"
                type="search"
                value={query}
              />
            </Label>
            <Label>
              Listing view
              <NativeSelect
                onChange={(event) => setView(event.target.value as ListingView)}
                value={view}
              >
                <option value="active">All active matches ({active.length})</option>
                <option value="alerts">In-app alerts ({alerts.length})</option>
                <option value="dismissed">Dismissed ({dismissed.length})</option>
              </NativeSelect>
            </Label>
            <Label>
              Sort by
              <NativeSelect onChange={(event) => setSort(event.target.value)} value={sort}>
                <option value="match">Best match</option>
                <option value="recent">Most recent</option>
              </NativeSelect>
            </Label>
          </div>
          <div className="job-hunter-results">
            <h2>{listingHeadings[view]}</h2>
            <span aria-live="polite" className="job-hunter-result-count">
              {discover.length}
              {hasQuery && ` of ${listings.length}`}{" "}
              {discover.length === 1 && !hasQuery ? "job" : "jobs"}
            </span>
            {hasQuery && (
              <Button onClick={() => setQuery("")} size="sm" variant="ghost">
                Clear search
              </Button>
            )}
          </div>
          {!discover.length && (
            <DiscoverEmpty
              hasEnabledSearch={data.searches.some((search) => search.enabled)}
              hasQuery={hasQuery}
              showActive={() => setView("active")}
              showSettings={() => setTab("settings")}
              view={view}
            />
          )}
          {discover.map((job) => (
            <MatchCard busy={busy} job={job} key={job.id} run={run} />
          ))}
        </TabsContent>
        <TabsContent className="job-hunter-stack" value="saved">
          <div className="job-hunter-results">
            <h2>Saved jobs</h2>
          </div>
          {!saved.length && (
            <EmptyState title="No saved jobs yet">
              <p>Save jobs from Discover to keep them handy.</p>
              <Button onClick={() => setTab("discover")} variant="outline">
                Browse matches
              </Button>
            </EmptyState>
          )}
          {saved.map((job) => (
            <MatchCard busy={busy} job={job} key={job.id} run={run} />
          ))}
        </TabsContent>
        <TabsContent className="job-hunter-stack" value="applications">
          <div className="job-hunter-results">
            <h2>Tracked applications</h2>
            <Button href={baseCvUrl} variant="outline">
              Download my private CV PDF
            </Button>
          </div>
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
              <CardTitle className="job-hunter-icon-title">
                <Bell aria-hidden="true" /> Browser alerts
              </CardTitle>
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
                <div className="job-hunter-scan" key={scan.id}>
                  <strong>
                    {data.searches.find((search) => search.id === scan.search_id)?.name ??
                      "Deleted search"}{" "}
                    · {date(scan.created_at)}
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
