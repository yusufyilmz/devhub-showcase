import { redirect } from "next/navigation";

import { dateKey } from "@shared/utils/date";

import { calendarSession } from "./_access";
import { CalendarWorkspace } from "./_calendar-workspace";
import { googleConfig } from "./_google";

export const metadata = { title: "My Calendar" };

export default async function MyCalendarPage({
  searchParams,
}: {
  searchParams: Promise<{ google?: string | string[] }>;
}) {
  const { user } = await calendarSession();
  if (!user) redirect("/login");
  const { google } = await searchParams;

  return (
    <CalendarWorkspace
      accountId={user.id}
      googleConfigured={Boolean(googleConfig())}
      googleNotice={typeof google === "string" ? google : undefined}
      initialDate={dateKey("UTC")}
      key={user.id}
    />
  );
}
