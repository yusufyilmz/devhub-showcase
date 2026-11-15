import { groupEntries } from "./utils";

export const fitnessCompanionFeatures = [
  ...groupEntries("Today and activity logging", [
    [
      "agenda",
      "Daily agenda",
      "Open Today to see your activities in time order. Select an activity to see its notes and subtasks.",
      "Today",
    ],
    [
      "progress",
      "Daily progress",
      "Tick off an activity as you go. Daily progress shows what you’ve completed or skipped.",
      "Today",
    ],
    [
      "hydration",
      "Hydration tracking",
      "Need a water break? Log a glass from the Hydration card and check it against your goal.",
      "Today",
    ],
    [
      "workouts",
      "Workouts, supersets and sets",
      "Open a workout to log reps and weight for each set. Previous results help you pick where to start.",
      "Today",
    ],
    [
      "meals",
      "Meals, ingredients and alternatives",
      "Open a meal to check its ingredients or choose an available alternative.",
      "Today",
    ],
    [
      "supplements",
      "Supplement routines",
      "Add supplements as routine tasks and check the activity details for the saved instructions.",
      "Today",
    ],
  ]),
  ...groupEntries("Plans and calendar", [
    [
      "task-plans",
      "Workout, diet and routine plans",
      "Open Tasks to choose a plan, explore its tasks and build a routine that fits your week.",
      "Tasks",
    ],
    [
      "task-edit",
      "Tasks and subtasks",
      "Create, edit or reorder the tasks inside a plan. Archive an old template to keep its past logs.",
      "Tasks",
    ],
    [
      "rotation",
      "Diet rotation and day overrides",
      "Use schedule settings to rotate meal plans and adjust an individual day as needed.",
      "Tasks",
    ],
    [
      "recurrence",
      "Weekday scheduling",
      "Give a template a time and choose the weekdays it should appear on your calendar.",
      "Tasks",
    ],
    [
      "calendar",
      "Calendar and date navigation",
      "Switch between month and week views. Select a date for its agenda or open an activity directly.",
      "Calendar",
    ],
    [
      "reschedule",
      "Reschedule an activity",
      "On desktop, drag a pending activity to another date. Its details also let you edit the date and time.",
      "Calendar",
    ],
    [
      "cooking",
      "Weekly cooking plan",
      "Open Week to turn the meals on your calendar into a cooking checklist.",
      "Week",
    ],
    [
      "shopping",
      "Weekly grocery list",
      "Open the shopping list in Week to see ingredients combined across your planned meals.",
      "Week",
    ],
    [
      "week-save",
      "Save and regenerate a week",
      "Save your cooking and shopping lists. If the meal plan changes, you can regenerate the week.",
      "Week",
    ],
  ]),
  ...groupEntries("Assistant and preferences", [
    [
      "assistant",
      "Fitness assistant",
      "Want help with a workout, a task, a shopping list or reminder? Open my chat and review the suggestion before saving.",
    ],
    [
      "reminders",
      "Activity reminders",
      "Turn on activity reminders in More. I can show a bubble when a scheduled activity is due.",
      "More",
    ],
    [
      "device-notifications",
      "Device notifications",
      "In More, set up device notifications and use the test action to check this device.",
      "More",
    ],
    [
      "goals",
      "Personal goals and time zone",
      "Set your hydration or protein targets, reminder lead time and workspace time zone in More.",
      "More",
    ],
    [
      "weight",
      "Weight tracking",
      "Log your weight in More if you want to keep a record alongside your daily routines.",
      "More",
    ],
    [
      "appearance",
      "Appearance",
      "Use the appearance control to switch your Fitness workspace between light and dark themes.",
    ],
    [
      "private",
      "Private workspace",
      "Your plans and activity logs are saved to your signed-in workspace.",
    ],
    [
      "preview",
      "Read-only demo",
      "Open the demo for a sample workspace you can explore without editing your own routines.",
      undefined,
      "/preview",
      "Open the demo",
    ],
    [
      "companion",
      "Your companion",
      "Drag me to either side. You can open this guide or turn off automatic tips whenever you like.",
    ],
  ]),
];
