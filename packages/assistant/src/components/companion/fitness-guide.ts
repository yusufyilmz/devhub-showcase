import { fitnessCompanionFeatures } from "@shared/config";
import type { Workspace } from "@shared/lib/types";

import type { AgentGuide } from "../chat/agent-companion/index";

export function fitnessGuide(
  state: Workspace,
  tab: string,
  paused: boolean,
  requestProgress: typeof fetch,
): AgentGuide {
  const evidence = {
    goals: state.settings.waterTarget !== 2000 || state.settings.proteinTarget !== 100,
    hydration: state.tasks.some((task) => task.kind === "water" && task.status === "done"),
    meals: state.ingredients.length > 0,
    private: true,
    progress: state.tasks.some((task) => task.scope === "scheduled" && task.status !== "pending"),
    recurrence: state.schedules.length > 0,
    reminders: state.settings.reminders,
    rotation: state.overrides.length > 0,
    supplements: state.tasks.some((task) => task.kind === "supplement" && task.status === "done"),
    "task-plans": state.tasks.some(
      (task) => task.kind === "gym" || (task.kind === "diet" && task.id !== "everyday-meals"),
    ),
    weight: state.weights.length > 0,
    workouts: state.tasks.some((task) => task.kind === "set" && task.status === "done"),
  };
  return {
    context: tab,
    features: fitnessCompanionFeatures,
    followUps: [
      {
        context: "Calendar",
        group: "Routine suggestions",
        id: "review-week",
        message:
          "Want to make next week easier? Check the calendar for activities you can move before they’re due.",
        title: "Review next week",
      },
      {
        context: "More",
        group: "Routine suggestions",
        id: "review-reminders",
        message: "If your routine changed, you can review your goals and reminder timing in More.",
        title: "Review your goals",
      },
    ],
    id: "fitness",
    observed: Object.keys(evidence).filter((id) => evidence[id as keyof typeof evidence]),
    paused,
    progressHref: "/api/companion-progress",
    progressRequest: requestProgress,
    title: "My Fitness Studio feature guide",
  };
}
