// NPM.
import test from 'tape';

// Local.
import * as proxy from '../src/proxy.js';
import * as injector from '../src/injector.js';

/*
 * Test Setup Helpers.
 */
const initial = {
  proxyTargets: injector.proxyTargets
};

// Restores the module to its initial state.
function reset () {
  injector.proxyTargets = {};
}

/*
 * Test Cases.
 */
test('# proxy.spec.js', (t) => t.end());

test('Should add a single proxy target', (assert) => {
  const target = {
    targets: ['bazaarvoice.com'],
    selector: 'body',
    manipulation: 'test',
    contents: 'contents'
  };
  proxy.proxy(target);

  assert.deepEqual(injector.proxyTargets, {
    "bazaarvoice.com": {
      selector: target.selector,
      manipulation: target.manipulation,
      contents: target.contents
    }
  });
  assert.end();
  reset();
});

test('Should add all proxy targets', (assert) => {
  const target = {
    targets: ['bazaarvoice.com', 'google.com'],
    selector: 'body',
    manipulation: 'test',
    contents: 'contents'
  };
  proxy.proxy(target);

  const expected = {
    selector: target.selector,
    manipulation: target.manipulation,
    contents: target.contents
  };
  assert.deepEqual(injector.proxyTargets, {
    "bazaarvoice.com": expected,
    "google.com": expected
  });
  assert.end();
  reset();
});

test('Should support a string target', (assert) => {
  const target = {
    targets: 'bazaarvoice.com',
    selector: 'body',
    manipulation: 'test',
    contents: 'contents'
  };
  proxy.proxy(target);

  const expected = {
    selector: target.selector,
    manipulation: target.manipulation,
    contents: target.contents
  };
  assert.deepEqual(injector.proxyTargets, {
    "bazaarvoice.com": expected
  });
  assert.end();
  reset();
});
