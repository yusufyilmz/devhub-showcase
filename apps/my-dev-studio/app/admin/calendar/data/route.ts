import { sameOrigin } from "@shared/auth";
import { calendarRangeSchema } from "@shared/calendar";
import type { Database } from "@shared/lib/types";

import { calendarJson, calendarSession } from "../_access";
import { type CalendarData, type StudioTask, taskMutation } from "../_contracts";
import { googleFeed } from "../_google";

type Row = Database["public"]["Tables"]["studio_calendar_tasks"]["Row"];

function calendarTask(row: Row): StudioTask {
  return {
    completed: row.completed,
    date: row.day,
    description: row.description,
    id: row.id,
    revision: row.revision,
    source: "studio",
    time: row.start_time?.slice(0, 5),
    title: row.title,
    type: "task",
  };
}

function sameAccount(request: Request, user: { id: string } | null) {
  return user && request.headers.get("x-calendar-account") === user.id ? user : null;
}

function taskStorageMissing(error: { code: string }) {
  return error.code === "42P01" || error.code === "PGRST205";
}

const taskSetupMessage =
  "Studio task storage isn’t set up yet. Ask your administrator to apply the calendar migration.";

export async function GET(request: Request) {
  const { client, user } = await calendarSession();
  const account = sameAccount(request, user);
  if (!account) return calendarJson({ error: "Sign in again to view your calendar." }, 401);
  const params = new URL(request.url).searchParams;
  const range = calendarRangeSchema.safeParse({
    from: params.get("from"),
    timeZone: params.get("timeZone"),
    to: params.get("to"),
  });
  if (!range.success) return calendarJson({ error: "Choose a valid date range." }, 400);

  const [{ data, error }, google] = await Promise.all([
    client
      .from("studio_calendar_tasks")
      .select("*")
      .eq("user_id", account.id)
      .gte("day", range.data.from)
      .lt("day", range.data.to)
      .order("day")
      .order("id"),
    googleFeed(account.id, range.data),
  ]);
  const result: CalendarData = {
    ...google,
    tasks: (data ?? []).map(calendarTask),
    warnings: error
      ? [
          ...google.warnings,
          taskStorageMissing(error)
            ? taskSetupMessage
            : "Studio tasks couldn’t load. Try refreshing the calendar.",
        ]
      : google.warnings,
  };
  return calendarJson(result);
}

export async function POST(request: Request) {
  if (!sameOrigin(request)) return calendarJson({ error: "Invalid origin." }, 403);
  const { client, user } = await calendarSession();
  const account = sameAccount(request, user);
  if (!account) return calendarJson({ error: "Sign in again to change your tasks." }, 401);

  const raw = await request.text();
  if (raw.length > 16_384) return calendarJson({ error: "This task is too large." }, 413);
  const input = taskMutation.safeParse(
    await Promise.resolve(raw)
      .then(JSON.parse)
      .catch(() => null),
  );
  if (!input.success)
    return calendarJson({ error: "Enter a title, a valid date, and an optional time." }, 400);

  const table = client.from("studio_calendar_tasks");
  const task = input.data;
  if (task.action === "delete") {
    const result = await table
      .delete()
      .eq("id", task.id)
      .eq("user_id", account.id)
      .eq("revision", task.revision)
      .select("id")
      .maybeSingle();
    return mutationResponse(result);
  }

  const fields = {
    completed: task.draft.completed,
    day: task.draft.date,
    description: task.draft.description,
    start_time: task.draft.time,
    title: task.draft.title,
  };
  if (task.action === "create") {
    const result = await table
      .insert({ ...fields, user_id: account.id })
      .select("id")
      .single();
    return mutationResponse(result);
  }

  const result = await table
    .update({ ...fields, revision: task.revision + 1 })
    .eq("id", task.id)
    .eq("user_id", account.id)
    .eq("revision", task.revision)
    .select("id")
    .maybeSingle();
  return mutationResponse(result);
}

function mutationResponse({ data, error }: { data: unknown; error: { code: string } | null }) {
  if (error)
    return calendarJson(
      {
        error: taskStorageMissing(error) ? taskSetupMessage : "Couldn’t save the task. Try again.",
      },
      503,
    );
  if (!data)
    return calendarJson(
      { error: "This task has changed. Refresh the calendar and try again." },
      409,
    );
  return calendarJson({ saved: true });
}
