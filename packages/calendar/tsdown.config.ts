import { defineLibraryConfig } from "@shared/cli/tsdown";

export default defineLibraryConfig({
  entry: [
    "src/index.ts",
    "src/components/agenda-details.tsx",
    "src/components/calendar-grid.tsx",
    "src/components/day-agenda.tsx",
    "src/components/event-row.tsx",
    "src/components/task-form.tsx",
    "src/services/google.ts",
  ],
});
