import { categories } from '../config/categories.ts';
import type { SavedState, Selection } from '../types/selection';
const KEY = 'nikki-outfit-roulette:v1';
export function createInitialState(): SavedState {
  return { draftSelection: {}, finalSelection: null, drawCounts: Object.fromEntries(categories.map(category => [category.id, category.defaultDrawCount])) };
}
const isRecord = (value: unknown): value is Record<string, unknown> => typeof value === 'object' && value !== null && !Array.isArray(value);
export function sanitizeSelection(value: unknown): Selection {
  if (!isRecord(value)) return {};
  const selection: Selection = {};
  for (const category of categories) {
    const ids = value[category.id];
    if (!Array.isArray(ids)) continue;
    const valid = ids.filter((id): id is string => typeof id === 'string' && category.options.some(option => option.id === id));
    const unique = category.allowDuplicates ? valid : [...new Set(valid)];
    if (unique.length) selection[category.id] = unique.slice(0, category.maxDrawCount);
  }
  return selection;
}
export function loadSelection(): SavedState {
  let raw: unknown;
  try { raw = JSON.parse(localStorage.getItem(KEY) ?? 'null'); } catch { raw = null; }
  const saved = isRecord(raw) ? raw : {};
  const counts = isRecord(saved.drawCounts) ? saved.drawCounts : {};
  const drawCounts: Record<string, number> = {};
  for (const category of categories) {
    const count = counts[category.id];
    drawCounts[category.id] = typeof count === 'number' && Number.isInteger(count)
      && count >= category.minDrawCount && count <= category.maxDrawCount ? count : category.defaultDrawCount;
  }
  const modeSelections: NonNullable<SavedState['modeSelections']> = {};
  if (isRecord(saved.modeSelections)) {
    for (const category of categories.filter(item => item.preserveModeResults)) {
      const modes = saved.modeSelections[category.id];
      if (!isRecord(modes)) continue;
      for (let count = category.minDrawCount; count <= category.maxDrawCount; count++) {
        const ids = sanitizeSelection({ [category.id]: modes[count] })[category.id];
        if (ids?.length === count) {
          modeSelections[category.id] ??= {};
          modeSelections[category.id][count] = ids;
        }
      }
    }
  }
  return {
    draftSelection: sanitizeSelection(saved.draftSelection),
    finalSelection: saved.finalSelection == null ? null : sanitizeSelection(saved.finalSelection),
    drawCounts,
    ...(Object.keys(modeSelections).length ? { modeSelections } : {}),
  };
}
export function saveSelection(state: SavedState): boolean {
  try {
    const initial = createInitialState();
    const empty = !Object.keys(state.draftSelection).length && state.finalSelection === null
      && !Object.keys(state.modeSelections ?? {}).length
      && categories.every(category => state.drawCounts[category.id] === initial.drawCounts[category.id]);
    if (empty) localStorage.removeItem(KEY);
    else localStorage.setItem(KEY, JSON.stringify(state));
    return true;
  } catch { return false; }
}
