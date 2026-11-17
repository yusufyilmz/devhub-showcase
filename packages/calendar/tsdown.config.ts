import { defineLibraryConfig } from "@shared/cli/tsdown";

export default defineLibraryConfig({
  entry: [
    "src/model.ts",
    "src/calendar-grid.tsx",
    "src/day-agenda.tsx",
    "src/task-form.tsx",
    "src/google.ts",
  ],
});
