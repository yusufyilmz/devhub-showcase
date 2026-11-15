import type { Task } from "@shared/lib/types";

import type { FitnessSuggestion, TaskEditProposal } from "../../models/fitness-assistant-contract";

export interface TaskEditorTarget {
  editDraft?: TaskEditProposal;
  parent?: Task;
  scheduleDraft?: { time: string; weekdays: number[] };
  suggestion?: FitnessSuggestion;
  task?: Task;
}
