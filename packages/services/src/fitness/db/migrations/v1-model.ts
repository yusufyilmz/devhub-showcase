import { z } from "zod";

const id = z.string().min(1).max(100);
const text = z.string().max(4000);
const time = z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/);
export const taskSchema = z.object({
  amount: z.number().nonnegative().max(10000).default(0),
  detail: text,
  id,
  kind: z.enum(["meal", "supplement", "water", "workout"]),
  planId: z.string(),
  time,
  title: text.min(1),
  workoutId: z.string().default(""),
});
export const exerciseSchema = z.object({
  group: text,
  id,
  name: text.min(1),
  notes: text,
  reps: z.array(z.number().int().min(1).max(200)).min(1).max(30),
});
export const workoutSchema = z.object({
  days: z.array(z.number().int().min(0).max(6)),
  exercises: z.array(exerciseSchema).max(100),
  id,
  name: text.min(1),
});
export const logSchema = z.object({
  done: z.boolean(),
  reps: z.number().min(0).max(200),
  weight: z.number().min(0).max(1500),
});
const date = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);
export const stateSchema = z.object({
  days: z.record(
    date,
    z.object({
      planId: id,
      sets: z.record(z.string(), logSchema),
      status: z.record(z.string(), z.enum(["done", "skip"])),
      tasks: z.array(taskSchema).max(100),
      water: z.number().min(0).max(20000),
      workout: workoutSchema.optional(),
      workoutId: z.string(),
    }),
  ),
  plans: z
    .array(z.object({ id, name: text.min(1) }))
    .min(1)
    .max(50),
  settings: z.object({
    gymTime: time,
    leadMinutes: z.number().int().min(0).max(120),
    name: text,
    proteinTarget: z.number().min(1).max(500),
    reminders: z.boolean(),
    rotation: z.array(id).min(1).max(100),
    startDate: date,
    timezone: z.string().refine((v) => {
      try {
        new Intl.DateTimeFormat("en", { timeZone: v });
        return true;
      } catch {
        return false;
      }
    }),
    waterTarget: z.number().min(250).max(10000),
  }),
  tasks: z.array(taskSchema).max(500),
  weights: z.array(z.object({ date, value: z.number().min(20).max(400) })).max(10000),
  workouts: z.array(workoutSchema).max(100),
});
export type State = z.infer<typeof stateSchema>;
export type Task = z.infer<typeof taskSchema>;
export type Workout = z.infer<typeof workoutSchema>;
export type Exercise = z.infer<typeof exerciseSchema>;
export const uid = () => crypto.randomUUID();
export function dateKey(zone = "Europe/Madrid", now = new Date()) {
  return new Intl.DateTimeFormat("en-CA", {
    day: "2-digit",
    month: "2-digit",
    timeZone: zone,
    year: "numeric",
  }).format(now);
}
export function shiftDate(date: string, n: number) {
  const d = new Date(`${date}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}
export function planFor(s: State, date: string) {
  const diff = Math.round(
    (Date.parse(`${date}T12:00:00Z`) - Date.parse(`${s.settings.startDate}T12:00:00Z`)) / 86400000,
  );
  const r = s.settings.rotation;
  return r[((diff % r.length) + r.length) % r.length];
}
export function makeDay(s: State, date: string, planId?: string, workoutId?: string) {
  const p = planId ?? planFor(s, date);
  const w =
    workoutId ??
    s.workouts.find((w) => w.days.includes(new Date(`${date}T12:00:00Z`).getUTCDay()))?.id ??
    "";
  const tasks = s.tasks.filter((t) => !t.planId || t.planId === p).map((t) => ({ ...t }));
  const workout = s.workouts.find((x) => x.id === w);
  if (workout)
    tasks.push({
      amount: 0,
      detail: `${workout.exercises.length} exercises · your training session`,
      id: "gym",
      kind: "workout",
      planId: "",
      time: s.settings.gymTime,
      title: workout.name,
      workoutId: w,
    });
  return {
    planId: p,
    sets: {},
    status: {},
    tasks: tasks.sort((a, b) => a.time.localeCompare(b.time)),
    water: 0,
    workout: workout ? structuredClone(workout) : undefined,
    workoutId: w,
  } as State["days"][string];
}
export function getDay(s: State, date: string) {
  return s.days[date] ?? makeDay(s, date);
}
export function waterTotal(day: State["days"][string]) {
  return (
    day.water +
    day.tasks.filter((t) => day.status[t.id] === "done").reduce((n, t) => n + t.amount, 0)
  );
}
export function previousSets(s: State, date: string, exerciseId: string) {
  const dates = Object.keys(s.days)
    .filter((d) => d < date)
    .sort()
    .reverse();
  for (const d of dates) {
    const day = s.days[d];
    if (!day) continue;
    const sets = Object.entries(day.sets).filter(
      ([k, v]) => k.startsWith(`${exerciseId}:`) && v.done,
    );
    if (sets.length) return { date: d, sets: Object.fromEntries(sets) };
  }
  return null;
}
export function containsPork(value: string) {
  return /\b(pork|cerdo|jam[oó]n|ham|bacon)\b/i.test(value);
}
export function validateReferences(s: State) {
  const plans = new Set(s.plans.map((p) => p.id));
  if (!s.settings.rotation.every((p) => plans.has(p))) return false;
  return s.tasks.every((t) => !t.planId || plans.has(t.planId));
}
