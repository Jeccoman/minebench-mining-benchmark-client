import assert from 'node:assert/strict';
import { detectNewShare } from './share-detection.ts';

// --- First observation (uninitialized sentinel = -1) ---

// No shares yet, first poll
const init0 = detectNewShare(0, { lastShareCount: -1 });
assert.equal(init0.shouldAnimate, false, 'no animation on first observation (0 shares)');
assert.equal(init0.newLastShareCount, 0, 'reference initialised to 0');

// Shares already present from a previous session on first poll
const initPrev = detectNewShare(3, { lastShareCount: -1 });
assert.equal(initPrev.shouldAnimate, false, 'no animation on first observation (prior-session shares)');
assert.equal(initPrev.newLastShareCount, 3, 'reference initialised to existing count');

// --- Transitions that SHOULD animate ---

// Classic case: 0 → 1 (first share found this session)
const first = detectNewShare(1, { lastShareCount: 0 });
assert.equal(first.shouldAnimate, true, 'animate on 0→1');
assert.equal(first.newLastShareCount, 1);

// Additional share: 3 → 4
const additional = detectNewShare(4, { lastShareCount: 3 });
assert.equal(additional.shouldAnimate, true, 'animate on 3→4');
assert.equal(additional.newLastShareCount, 4);

// Jump of several: 1 → 5
const jump = detectNewShare(5, { lastShareCount: 1 });
assert.equal(jump.shouldAnimate, true, 'animate on 1→5 (multi-share jump)');
assert.equal(jump.newLastShareCount, 5);

// --- Transitions that should NOT animate ---

// Count unchanged
const same = detectNewShare(4, { lastShareCount: 4 });
assert.equal(same.shouldAnimate, false, 'no animation when count unchanged');
assert.equal(same.newLastShareCount, 4, 'reference unchanged when count is same');

// Count appears to decrease (stale/resync from server) — reference kept, no animation
const decrease = detectNewShare(2, { lastShareCount: 4 });
assert.equal(decrease.shouldAnimate, false, 'no animation on apparent decrease');
assert.equal(decrease.newLastShareCount, 4, 'reference preserved on decrease');

// Zero stays zero
const zeroToZero = detectNewShare(0, { lastShareCount: 0 });
assert.equal(zeroToZero.shouldAnimate, false, 'no animation on 0→0');
assert.equal(zeroToZero.newLastShareCount, 0);

console.log('share-detection tests passed');
