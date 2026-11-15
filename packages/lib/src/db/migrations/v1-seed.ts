import type { State, Task } from "./v1-model";

const meal = (
  id: string,
  planId: string,
  title: string,
  time: string,
  detail: string,
  amount = 500,
): Task => ({
  amount,
  detail,
  id,
  kind: "meal",
  planId,
  time,
  title,
  workoutId: "",
});
const exercises = (rows: [string, string?, number[]?, string?][]) =>
  rows.map(([name, group = "", reps = [12, 10, 8, 6, 4], notes = ""], _i) => ({
    group,
    id: name.toLowerCase().replace(/[^a-z]+/g, "-"),
    name,
    notes,
    reps,
  }));
export function seed(): State {
  return {
    days: {},
    plans: [
      { id: "y1", name: "Yusuf 1" },
      { id: "y2", name: "Yusuf 2" },
    ],
    settings: {
      gymTime: "18:30",
      leadMinutes: 0,
      name: "Yusuf",
      proteinTarget: 175,
      reminders: false,
      rotation: ["y1", "y1", "y2"],
      startDate: "2026-10-19",
      timezone: "Europe/Madrid",
      waterTarget: 2500,
    },
    tasks: [
      meal(
        "y1-breakfast",
        "y1",
        "Breakfast",
        "08:00",
        "3 whole eggs · 30 g mozzarella\n1 level tbsp turmeric, matcha and maca · pinch of pepper\nCoffee, or coffee with plant milk and stevia",
      ),
      meal(
        "y1-lunch",
        "y1",
        "Lunch",
        "13:30",
        "250 g chicken, turkey, fish or beef\n125 g quinoa, basmati rice or couscous\nGrilled, oven baked or air fried",
      ),
      meal(
        "y1-snack",
        "y1",
        "Afternoon snack",
        "16:30",
        "Thins sandwich with mozzarella, turkey, chicken, tuna or salmon\n1–2 sugar-free gelatins\nCoffee or tea with stevia",
      ),
      meal(
        "y1-dinner",
        "y1",
        "Dinner",
        "21:00",
        "1 cup gazpacho or vegetable soup\n250 g chicken, turkey, fish or beef\nUnlimited salad with 3 ingredients\n2 sugar-free gelatins",
        0,
      ),
      meal(
        "y2-breakfast",
        "y2",
        "Breakfast",
        "08:00",
        "4 whole eggs\n1 level tbsp turmeric, matcha and maca · pinch of pepper\nCoffee or tea with stevia",
      ),
      meal("y2-lunch", "y2", "Lunch", "13:30", "Salad of your choice"),
      meal("y2-snack", "y2", "Afternoon snack", "16:30", "2 low-fat yogurts\n1 piece of fruit"),
      meal(
        "y2-dinner",
        "y2",
        "Dinner",
        "21:00",
        "1 large cup gazpacho or vegetable soup\nSalad with 4 ingredients\n2 sugar-free gelatins",
        0,
      ),
      ...[
        ["creatine-am", "Creatine", "08:00", "5 g · current trainer plan"],
        ["glutamine", "Glutamine", "08:00", "5 g · current trainer plan"],
        ["creatine-pm", "Creatine", "16:00", "3 g · current trainer plan"],
        ["water", "Water break", "10:30", "500 ml of water"],
      ].map(
        ([id, title, time, detail]) =>
          ({
            amount: id === "water" ? 500 : 0,
            detail,
            id,
            kind: id === "water" ? "water" : "supplement",
            planId: "",
            time,
            title,
            workoutId: "",
          }) as Task,
      ),
    ],
    weights: [],
    workouts: [
      {
        days: [1],
        exercises: exercises([
          [
            "Hip Abduction Machine",
            "",
            [20, 15, 12, 10, 8, 6, 6, 6, 15],
            "Last four sets: drop weight between sets, no rest.",
          ],
          ["Barbell Curl", "Superset 1"],
          ["French Press / Skull Crusher", "Superset 1"],
          ["Concentration Curl", "Superset 2"],
          ["Triceps Kickback", "Superset 2"],
          ["Hammer Curl", "Superset 3"],
          ["Bench Dips", "Superset 3", [12, 12, 12, 12]],
          ["Low Cable Curl", "Superset 4", [12, 10, 8, 6]],
          ["Cable Triceps Pushdown", "Superset 4", [12, 10, 8, 6]],
        ]),
        id: "w1",
        name: "Glutes + Arms",
      },
      {
        days: [2],
        exercises: exercises([
          ["Leg Extension", "Superset 1"],
          ["Leg Curl", "Superset 1"],
          ["Dumbbell Shoulder Press"],
          ["Incline Lateral Raise"],
          ["Rear Delt Fly"],
          ["Seated Lateral Raise", "Superset 2"],
          ["Incline Front Raise", "Superset 2"],
        ]),
        id: "w2",
        name: "Legs + Shoulders",
      },
      {
        days: [4],
        exercises: exercises([
          ["Leg Press"],
          ["Machine Chest Press"],
          ["Incline Chest Press"],
          ["Cable Fly"],
          ["Pec Deck"],
        ]),
        id: "w3",
        name: "Legs + Chest",
      },
      {
        days: [6],
        exercises: exercises([
          ["Squat", "Superset 1"],
          ["Dumbbell Calf Raise", "Superset 1"],
          ["Machine Row"],
          ["One-Arm Dumbbell Row"],
          ["Lat Pulldown"],
          ["Single-Arm Cable Row"],
          ["Low Cable Row"],
        ]),
        id: "w4",
        name: "Legs + Calves + Back",
      },
    ],
  };
}
