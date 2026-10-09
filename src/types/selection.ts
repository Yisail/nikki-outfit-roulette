export type Selection = Record<string, string[]>;
export interface SavedState {
  draftSelection: Selection;
  finalSelection: Selection | null;
  drawCounts: Record<string, number>;
  modeSelections?: Record<string, Record<string, string[]>>;
}
