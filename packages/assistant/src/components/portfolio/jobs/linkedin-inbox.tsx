import { Button } from "@shared/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@shared/ui/cards";
import { Input } from "@shared/ui/input";
import { Label } from "@shared/ui/label";
import { Textarea } from "@shared/ui/textarea";

import type { LinkedInAlerts, RunJobAction } from "./types";

export function LinkedInInbox({
  inbox,
  busy,
  run,
}: {
  inbox: LinkedInAlerts;
  busy: boolean;
  run: RunJobAction;
}) {
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Forward LinkedIn job alerts</CardTitle>
        </CardHeader>
        <CardContent className="job-hunter-stack">
          {inbox.address ? (
            <>
              <Label>
                Private forwarding address
                <Input readOnly value={inbox.address} />
              </Label>
              <p>
                Use the same verified email address you use to sign in. Enable email alerts on
                LinkedIn, then forward an alert. A forwarding rule can be used if your relay
                verifies the forwarding account.
              </p>
              <div className="job-hunter-actions">
                <Button
                  disabled={busy}
                  onClick={() => run({ action: "refresh" })}
                  variant="outline"
                >
                  Check for alerts
                </Button>
                <Button
                  disabled={busy}
                  onClick={() => run({ action: "disableLinkedInAlerts" })}
                  variant="outline"
                >
                  Disable forwarding
                </Button>
              </div>
            </>
          ) : (
            <Button disabled={busy} onClick={() => run({ action: "enableLinkedInAlerts" })}>
              Create forwarding address
            </Button>
          )}
        </CardContent>
      </Card>
      {!inbox.jobs.length && <p>No LinkedIn jobs are waiting for review.</p>}
      {inbox.jobs.map((job) => (
        <Card key={job.id}>
          <CardHeader>
            <CardTitle>{job.title || "LinkedIn job"}</CardTitle>
          </CardHeader>
          <CardContent className="job-hunter-stack">
            <Button href={job.url} rel="noopener noreferrer" target="_blank" variant="outline">
              View original listing
            </Button>
            <form
              className="job-hunter-stack"
              onSubmit={(event) => {
                event.preventDefault();
                const fields = new FormData(event.currentTarget);
                return run({
                  action: "reviewLinkedInJob",
                  id: job.id,
                  job: Object.fromEntries(fields),
                });
              }}
            >
              <Label>
                Job title
                <Input defaultValue={job.title} maxLength={180} name="title" required />
              </Label>
              <Label>
                Company
                <Input maxLength={180} name="company" />
              </Label>
              <Label>
                Location
                <Input maxLength={180} name="location" />
              </Label>
              <Label>
                Requirements for CV matching (optional)
                <Textarea maxLength={2000} name="description" rows={3} />
              </Label>
              <div className="job-hunter-actions">
                <Button disabled={busy} type="submit">
                  Save and match
                </Button>
                <Button
                  disabled={busy}
                  onClick={() => run({ action: "discardLinkedInJob", id: job.id })}
                  variant="outline"
                >
                  Discard
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      ))}
    </>
  );
}
