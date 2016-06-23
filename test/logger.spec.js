/**
 * Unit tests for src/logger.
 */

// NPM.
import test from 'tape';

// Local.
import * as logger from '../src/logger.js';

/*
 * Test Cases.
 */
// This is for formatting the output only.
test('# logger.spec.js', (t) => t.end());

test('Should provide an enableLogging function', (assert) => {
  assert.equal(typeof logger.enableLogging, 'function', 'Is a function');

  assert.end();
});

test('Should provide a log function', (assert) => {
  assert.equal(typeof logger.log, 'function', 'Is a function');

  assert.end();
});
