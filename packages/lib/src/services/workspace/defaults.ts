import { createTask, dateKey, type Workspace } from "../../types/index";

export function starterWorkspace(): Workspace {
  return {
    choices: [],
    ingredients: [],
    overrides: [],
    schedules: [],
    settings: {
      leadMinutes: 10,
      name: "Athlete",
      proteinTarget: 100,
      reminders: false,
      rotation: ["everyday-meals"],
      rotationStart: dateKey("UTC"),
      timezone: "UTC",
      waterTarget: 2000,
    },
    tasks: [createTask({ id: "everyday-meals", kind: "diet", title: "Everyday meals" })],
    version: 2,
    weights: [],
  };
}

export function demoWorkspace(): Workspace {
  const workspace = starterWorkspace();
  workspace.settings.name = "Sam";
  const date = dateKey(workspace.settings.timezone);
  const parentId = `day:${date}`;
  workspace.tasks.push(
    createTask({ date, id: parentId, kind: "day", scope: "scheduled", title: "Demo day" }),
    createTask({
      date,
      id: "demo-walk",
      kind: "workout",
      parentId,
      scope: "scheduled",
      time: "17:30",
      title: "Afternoon walk",
    }),
    createTask({
      date,
      details: { ml: 250, type: "water" },
      id: "demo-water",
      kind: "water",
      parentId,
      scope: "scheduled",
      status: "done",
      time: "09:00",
      title: "Morning water",
    }),
  );
  return workspace;
}
