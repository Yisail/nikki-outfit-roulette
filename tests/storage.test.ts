import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createInitialState, loadSelection, saveSelection, sanitizeSelection } from '../src/storage/selectionStorage.ts';
let stored: string | null = null;
Object.defineProperty(globalThis, 'localStorage', { value: {
  getItem: () => stored,
  setItem: (_key: string, value: string) => { stored = value; },
  removeItem: () => { stored = null; },
}, configurable: true });
test('selection removes stale IDs, unknown categories, duplicates and excess choices', () => {
  assert.deepEqual(sanitizeSelection({ color: ['pink', 'pink', 'deleted', 'gold', 'blue'], style: ['gothic'], invalid: ['x'] }), { color: ['pink', 'gold'], style: ['gothic'] });
  assert.deepEqual(sanitizeSelection(null), {});
});
test('corrupted storage resets safely and draw counts are validated', () => {
  stored = '{broken';
  assert.deepEqual(loadSelection().draftSelection, {});
  stored = JSON.stringify({ drawCounts: { color: 99, style: -1 }, draftSelection: { color: ['pink'] } });
  assert.equal(loadSelection().drawCounts.color, 1);
  assert.equal(loadSelection().drawCounts.style, 1);
  assert.deepEqual(loadSelection().draftSelection, { color: ['pink'] });
});
test('round-trip keeps draft, final snapshot, and counts separate', () => {
  const state = { draftSelection: { style: ['uniform'] }, finalSelection: { color: ['pink', 'gold'] }, drawCounts: { color: 2, style: 1, 'game-tag': 1, scene: 1 } };
  assert.ok(saveSelection(state));
  assert.deepEqual(loadSelection(), state);
});
test('confirmed style modes persist separately and invalid mode results are discarded', () => {
  const state = { draftSelection: { style: ['gothic', 'punk'], scene: ['stage'] }, finalSelection: null, drawCounts: { color: 1, style: 2, 'game-tag': 1, scene: 1 }, modeSelections: { style: { 1: ['uniform'], 2: ['gothic', 'punk'] } } };
  assert.ok(saveSelection(state));
  assert.deepEqual(loadSelection(), state);
  stored = JSON.stringify({ modeSelections: { style: { 1: ['deleted'], 2: ['gothic', 'gothic'], 3: ['punk'] } } });
  assert.equal(loadSelection().modeSelections, undefined);
});
test('reset round removes the cache and restores default counts', () => {
  stored = JSON.stringify({ draftSelection: { style: ['gothic', 'punk'] }, drawCounts: { style: 2 } });
  assert.ok(saveSelection(createInitialState()));
  assert.equal(stored, null);
  assert.deepEqual(loadSelection(), createInitialState());
});
test('unavailable localStorage never crashes the app', () => {
  Object.defineProperty(globalThis, 'localStorage', { get() { throw new Error('disabled'); }, configurable: true });
  assert.deepEqual(loadSelection().draftSelection, {});
  assert.equal(saveSelection({ draftSelection: {}, finalSelection: null, drawCounts: {} }), false);
});
