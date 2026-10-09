import { test } from 'node:test';
import assert from 'node:assert/strict';
import { drawRandom } from '../src/core/random.ts';
test('two draws are unique, valid, and do not mutate input', () => {
  const pool = ['pink', 'gold', 'blue'];
  for (let i = 0; i < 200; i++) {
    const drawn = drawRandom(pool, 2, false);
    assert.equal(drawn.length, 2);
    assert.equal(new Set(drawn).size, 2);
    assert.ok(drawn.every(id => pool.includes(id)));
  }
  assert.deepEqual(pool, ['pink', 'gold', 'blue']);
});
test('invalid counts and empty options are safe', () => {
  for (const count of [0, -1, NaN, Infinity]) assert.deepEqual(drawRandom([1], count), []);
  assert.deepEqual(drawRandom([], 2), []);
  assert.equal(drawRandom([1, 2], 99).length, 2);
  assert.equal(drawRandom([1, 2], 1.9).length, 1);
});
test('duplicate mode supports N draws from a small pool', () => {
  assert.deepEqual(drawRandom(['pink'], 3, true), ['pink', 'pink', 'pink']);
});
