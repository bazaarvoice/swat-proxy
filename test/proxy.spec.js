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
const options = {
  selector: selector,
  manipulation: manipulation,
  content: content
};

function reset () {
  injector.proxyTargets = {};
}

/*
 * Test Cases.
 */
// This is for formatting the output only.
test('# proxy.spec.js', (t) => t.end());

test('#proxy Should add a proxy target', (assert) => {
  proxy.proxy(targetURL, options);

  const expected = [{
    selector: options.selector,
    manipulation: options.manipulation,
    content: options.content
  }];
  assert.deepEqual(injector.proxyTargets, {
    'bazaarvoice.com': expected
  }, 'A proxy target was added');

  assert.end();
  reset();
});

test('#proxy Should add multiple proxy targets', (assert) => {
  // First call.
  const firstOptions = {
    selector: selector,
    manipulation: manipulation,
    content: '<div>#1</div>'
  };
  proxy.proxy(targetURL, firstOptions);

  // Second call.
  const secondOptions = {
    selector: selector,
    manipulation: manipulation,
    content: '<div>#2</div>'
  };
  proxy.proxy(targetURL, secondOptions);

  assert.deepEqual(injector.proxyTargets, {
    'bazaarvoice.com': [{
      selector: firstOptions.selector,
      manipulation: firstOptions.manipulation,
      content: firstOptions.content
    }, {
      selector: secondOptions.selector,
      manipulation: secondOptions.manipulation,
      content: secondOptions.content
    }]
  }, 'All proxy targets were added');

  assert.end();
  reset();
});

test('#proxy Should handle an array of options as proxy targets', (assert) => {
  const firstOptions = {
    selector: selector,
    manipulation: manipulation,
    content: '<div>#1</div>'
  };
  const secondOptions = {
    selector: selector,
    manipulation: manipulation,
    content: '<div>#2</div>'
  };

  proxy.proxy(targetURL, [firstOptions, secondOptions]);

  assert.deepEqual(injector.proxyTargets, {
    'bazaarvoice.com': [{
      selector: firstOptions.selector,
      manipulation: firstOptions.manipulation,
      content: firstOptions.content
    }, {
      selector: secondOptions.selector,
      manipulation: secondOptions.manipulation,
      content: secondOptions.content
    }]
  }, 'All proxy targets were added');

  assert.end();
  reset();
});

test('#proxy Should throw when missing required param: target', (assert) => {
  assert.throws(() => proxy.proxy(null, options), null, 'Missing \'target\' should throw');

  assert.end();
  reset();
});

test('#proxy Should throw when missing required options params', (assert) => {
  let badOptions = options;

  for (let key of Object.keys(options)) {
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
