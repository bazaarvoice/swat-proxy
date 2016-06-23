// NPM.
import test from 'tape';

// Local.
import * as injector from '../src/injector.js';
import { Manipulations } from '../src/manipulations.js';

// Members.
const targetURL = 'bazaarvoice.com';
const serverHTML = new Buffer('<html><body>UNIT TEST</body></html>');
const selector = 'body';
const manipulation = Manipulations.APPEND;
const content = '<div>injected content</div>';

function reset () {
  injector.proxyTargets = {};
}

/*
 * Test Cases.
 */
// This is for formatting the output only.
test('# injector.spec.js', (t) => t.end());

test('#addProxyTarget Should work when target does not exist', (assert) => {
  injector.addProxyTarget(targetURL, {
    selector: selector,
    manipulation: manipulation,
    content: content
  });

  assert.equal(Object.keys(injector.proxyTargets).length, 1, 'A proxyTarget was created');
  assert.equal(injector.proxyTargets[targetURL].length, 1, 'Only one option was created');

  assert.end();
  reset();
});

test('#addProxyTarget Should work when target already exists', (assert) => {
  // Setup: set up this target first.
  injector.addProxyTarget(targetURL, {
    selector: selector,
    manipulation: manipulation,
    content: content
  });

  // Test: add another proxyTarget with the same target (key).
  injector.addProxyTarget(targetURL, {
    selector: selector,
    manipulation: manipulation,
    content: content
  });
  assert.equal(Object.keys(injector.proxyTargets).length, 1, 'A new proxyTarget was not created');
  assert.equal(injector.proxyTargets[targetURL].length, 2, 'The existing proxyTarget was added to');

  assert.end();
  reset();
});

test('#injectInto Should alter response when target matches.', (assert) => {
  // Setup: Proxy target matches URL.
  injector.addProxyTarget(targetURL, {
    selector: selector,
    manipulation: manipulation,
    content: content
  });
  const result = injector.injectInto(targetURL, serverHTML);

  assert.equal(
    result.indexOf(content) >= 0,
    true,
    'Result contains injected content.'
  );

  assert.end();
  reset();
});

test('#injectInto Should not alter response when no target matches.', (assert) => {
  // Setup: Proxy target does not match URL.
  injector.addProxyTarget(targetURL, {
    selector: selector,
    manipulation: manipulation,
    content: content
  });
  const result = injector.injectInto('google.com', serverHTML);

  assert.equal(result, serverHTML, 'Result was not altered');

  assert.end();
  reset();
});
