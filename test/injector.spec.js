/**
 * Test tests.
 */

import test from 'tape';

// Pass.
test('A passing test', (assert) => {
  assert.pass('This test passed.');
  assert.end();
});

// Fail.
test('A failing test', (assert) => {
  assert.fail('This test failed.');
  assert.end();
});