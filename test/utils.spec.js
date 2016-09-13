/**
 * Unit tests for src/utils.
 */

// NPM.
import test from 'tape';

// Local.
import { trimSlash } from '../src/utils.js';

/*
 * Test Cases.
 */
// This is for formatting the output only.
test('# utils.spec.js', (t) => t.end());

test('Should trim a trailing slash from the end of a string', (assert) => {
  const expected = 'http://www.google.com';
  const actual = trimSlash('http://www.google.com/');
  assert.equal(actual, expected, 'removed trailing slash');

  assert.end();
});

test('Should not alter a string if there is no trailing slash', (assert) => {
  const expected = 'http://www.google.com';
  const actual = trimSlash('http://www.google.com');
  assert.equal(actual, expected, 'string remains unaltered');

  assert.end();
});
