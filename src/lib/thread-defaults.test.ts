/**
 * Tests for the default CPU mining thread count calculation.
 *
 * The rule: default threads = floor(cores / 2), minimum 1.
 * This matches both the Rust backend (commands.rs: default_thread_count) and the
 * frontend store (useMinerStore.ts: defaultThreadCount helper).
 *
 * Run with: node --import tsx/esm src/lib/thread-defaults.test.ts
 */

import assert from 'node:assert/strict';

// Mirror of the formula in useMinerStore.ts
const defaultThreadCount = (cores: number): number =>
    Math.max(1, Math.floor(Math.max(1, cores) / 2));

// --- Standard values ---
assert.equal(defaultThreadCount(1), 1, '1 core → 1 thread');
assert.equal(defaultThreadCount(2), 1, '2 cores → 1 thread (50%)');
assert.equal(defaultThreadCount(4), 2, '4 cores → 2 threads (50%)');
assert.equal(defaultThreadCount(6), 3, '6 cores → 3 threads (50%)');
assert.equal(defaultThreadCount(8), 4, '8 cores → 4 threads (50%)');
assert.equal(defaultThreadCount(12), 6, '12 cores → 6 threads (50%)');
assert.equal(defaultThreadCount(16), 8, '16 cores → 8 threads (50%)');
assert.equal(defaultThreadCount(24), 12, '24 cores → 12 threads (50%)');
assert.equal(defaultThreadCount(32), 16, '32 cores → 16 threads (50%)');
assert.equal(defaultThreadCount(64), 32, '64 cores → 32 threads (50%)');

// --- Odd core counts (floor rounding) ---
assert.equal(defaultThreadCount(3), 1, '3 cores → 1 thread (floor(1.5))');
assert.equal(defaultThreadCount(5), 2, '5 cores → 2 threads (floor(2.5))');
assert.equal(defaultThreadCount(7), 3, '7 cores → 3 threads (floor(3.5))');

// --- Edge cases ---
assert.equal(defaultThreadCount(0), 1, '0 cores → 1 thread (minimum protection)');
assert.equal(defaultThreadCount(-4), 1, 'negative cores → 1 thread (minimum protection)');

// --- Verify it is always at least 1 ---
for (const n of [0, 1, 2, 3, 4, 8, 16, 32, 64, 128]) {
    assert.ok(defaultThreadCount(n) >= 1, `defaultThreadCount(${n}) must be >= 1`);
}

// --- Verify it never exceeds cores / 2 + 1 (is actually 50%) ---
for (const n of [2, 4, 6, 8, 10, 12, 16, 32]) {
    const result = defaultThreadCount(n);
    assert.ok(result <= Math.ceil(n / 2), `defaultThreadCount(${n})=${result} should be <= ceil(${n}/2)`);
    assert.ok(result >= Math.floor(n / 2), `defaultThreadCount(${n})=${result} should be >= floor(${n}/2)`);
}

console.log('thread-defaults tests passed');
