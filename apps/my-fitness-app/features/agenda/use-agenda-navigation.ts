"use client";
import { useEffect, useState } from "react";

import { dateSchema } from "@shared/services/types";
export function dayHref(date: string, taskId?: string) {
  const query = new URLSearchParams({ date, view: "day" });
  if (taskId) query.set("task", taskId);
  return `?${query.toString()}`;
}
export function useAgendaNavigation(today: string) {
  const [view, setView] = useState({
    date: today,
    tab: "Today",
    taskId: null as string | null,
  });
  useEffect(() => {
    const restore = () => {
      const q = new URLSearchParams(location.search);
      const parsedDate = dateSchema.safeParse(q.get("date"));
      const date = parsedDate.success ? parsedDate.data : today;
      const requested = q.get("view");
      const tab =
        requested && ["Tasks", "Week", "Calendar", "More"].includes(requested)
          ? requested
          : "Today";
      setView({ date, tab, taskId: tab === "Today" ? q.get("task") : null });
    };
    restore();
    window.addEventListener("popstate", restore);
    return () => window.removeEventListener("popstate", restore);
  }, [today]);
  function navigate(next: typeof view) {
    setView(next);
    const query = new URLSearchParams({
      date: next.date,
      view: next.tab === "Today" ? "day" : next.tab,
    });
    if (next.taskId) query.set("task", next.taskId);
    history.pushState(null, "", `?${query.toString()}`);
  }
  return {
    ...view,
    openDay: (date: string) => navigate({ date, tab: "Today", taskId: null }),
    openTask: (date: string, taskId: string) => navigate({ date, tab: "Today", taskId }),
    setDate: (date: string) => navigate({ ...view, date, taskId: null }),
    setTab: (tab: string) =>
      navigate({
        date: tab === "Today" ? today : view.date,
        tab,
        taskId: null,
      }),
  };
}
