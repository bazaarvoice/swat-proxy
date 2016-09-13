/**
 * Unit tests for src/proxy.
 */

// NPM.
import test from 'tape';

// Local.
import * as proxy from '../src/proxy.js';
import * as injector from '../src/injector.js';

// Members
const targetURL = 'bazaarvoice.com';
const selector = 'body';
const manipulation = 'append';
const content = '<div>injected content</div>';
const matchType = 'exact';
const options = {
  selector,
  manipulation,
  content,
  matchType
};

function reset () {
  injector.proxyTargets = new Map();
}

/*
 * Test Cases.
 */
// This is for formatting the output only.
test('# proxy.spec.js', (t) => t.end());

test('#proxy Should add a proxy target', (assert) => {
  proxy.proxy(targetURL, options);

  const expected = new Map([
    [targetURL, new Set([options])]
  ]);
  assert.deepEqual(injector.proxyTargets, expected, 'A proxy target was added');

  assert.end();
  reset();
});

test('#proxy Should add multiple proxy targets', (assert) => {
  // First call.
  const firstOptions = {
    ...options,
    content: '<div>#1</div>'
  };
  proxy.proxy(targetURL, firstOptions);

  // Second call.
  const secondOptions = {
    ...options,
    content: () => '<div>#2</div>'
  };
  proxy.proxy(targetURL, secondOptions);

  const expected = new Map([
    [targetURL, new Set([
      firstOptions,
      secondOptions
    ])]
  ]);

  assert.deepEqual(injector.proxyTargets, expected, 'All proxy targets were added');

  assert.end();
  reset();
});

test('#proxy Should handle an array of options as proxy targets', (assert) => {
  const firstOptions = {
    ...options,
    content: '<div>#1</div>'
  };
  const secondOptions = {
    ...options,
    content: () => '<div>#2</div>'
  };
  proxy.proxy(targetURL, [firstOptions, secondOptions]);

  const expected = new Map([
    [targetURL, new Set([
      firstOptions,
      secondOptions
    ])]
  ]);

  assert.deepEqual(injector.proxyTargets, expected, 'All proxy targets were added');

  assert.end();
  reset();
});

test('#proxy Should throw when missing required param: target', (assert) => {
  assert.throws(() => proxy.proxy(null, options), null, 'Missing \'target\' should throw');

  assert.end();
  reset();
});

test('#proxy Should throw when missing required options params', (assert) => {
  let badOptions = { ...options };

  // We don't need to check this for matchType, it has
  // an internal default for backwards compatibility
  delete badOptions.matchType;

  for (let key of Object.keys(badOptions)) {
    // Remove this key from badOptions.
    badOptions[key] = undefined;

    // Test that calling proxy without this key results in an error.
    assert.throws(() => proxy.proxy(targetURL, badOptions), null, `Missing '${key}' should throw`);

    // Add this key back to badOptions for the next test.
    badOptions[key] = options[key];
  }

  assert.end();
  reset();
});

test('#removeProxy Should remove a proxy target', (assert) => {
  proxy.proxy(targetURL, options);

  const expected = new Map([
    [targetURL, new Set([options])]
  ]);

  assert.deepEqual(injector.proxyTargets, expected, 'A proxy target was added');

  proxy.removeProxy(targetURL, options);

  assert.deepEqual(injector.proxyTargets, new Map(), 'A proxy target was removed');

  assert.end();
  reset();
});

test('#removeProxy Should remove multiple proxy targets', (assert) => {
  const firstOptions = {
    ...options,
    content: '<div>#1</div>'
  };
  const secondOptions = {
    ...options,
    content: () => '<div>#2</div>'
  };

  proxy.proxy(targetURL, [firstOptions, secondOptions]);

  const expected = new Map([
    [targetURL, new Set([
      firstOptions,
      secondOptions
    ])]
  ]);

  assert.deepEqual(injector.proxyTargets, expected, 'All proxy targets were added');

  proxy.removeProxy(targetURL, firstOptions);
  proxy.removeProxy(targetURL, secondOptions);

  assert.deepEqual(injector.proxyTargets, new Map(), 'All proxy targets were removed');

  assert.end();
  reset();
});

test('#removeProxy Should handle removing an array of options from proxy targets', (assert) => {
  const firstOptions = {
    ...options,
    content: '<div>#1</div>'
  };
  const secondOptions = {
    ...options,
    content: () => '<div>#2</div>'
  };
  proxy.proxy(targetURL, [firstOptions, secondOptions]);

  const expected = new Map([
    [targetURL, new Set([
      firstOptions,
      secondOptions
    ])]
  ]);

  assert.deepEqual(injector.proxyTargets, expected, 'All proxy targets were added');

  proxy.removeProxy(targetURL, [firstOptions, secondOptions]);

  assert.deepEqual(injector.proxyTargets, new Map(), 'All proxy targets were removed');

  assert.end();
  reset();
});

test('#removeProxy Should clear all options from proxy target when no options are passed', (assert) => {
  const firstOptions = {
    ...options,
    content: '<div>#1</div>'
  };
  const secondOptions = {
    ...options,
    content: () => '<div>#2</div>'
  };
  proxy.proxy(targetURL, [firstOptions, secondOptions]);

  const expected = new Map([
    [targetURL, new Set([
      firstOptions,
      secondOptions
    ])]
  ]);

  assert.deepEqual(injector.proxyTargets, expected, 'All proxy targets were added');

  proxy.removeProxy(targetURL);

  assert.deepEqual(injector.proxyTargets, new Map(), 'All proxy targets were removed');

  assert.end();
  reset();
});

test('#removeProxy Should throw when missing required param: target', (assert) => {
  assert.throws(() => proxy.proxy(null, options), null, 'Missing \'target\' should throw');

  assert.end();
  reset();
});
