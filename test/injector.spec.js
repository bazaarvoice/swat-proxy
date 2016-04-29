// NPM.
import test from 'tape';

// Local.
import * as injector from '../src/injector.js';

/*
 * Test Setup Helpers.
 */
const previousProxyTargets = injector.proxyTargets;

// Restores the module to its initial state.
function reset () {
  injector.proxyTargets = previousProxyTargets;
}

/*
 * Test Cases.
 */
test('Should not alter response when no target matches.', (assert) => {
  // Setup: Proxy target does not match URL.
  const serverHTML = 'html';
  injector.proxyTargets = { 'aol.com': 'value' };
  const result = injector.injectInto('google.com', serverHTML);

  assert.equal(result, serverHTML);
  assert.end();
  reset();
});

test('Should alter response when target matches.', (assert) => {
  // Setup: Proxy target does match URL.
  const targetURL = 'bazaarvoice.com';
  const serverHTML = new Buffer('<html><body>html</body></html>');
  const injected = 'value';

  injector.proxyTargets[targetURL] = injected;
  const result = injector.injectInto(targetURL, serverHTML, assert);

  assert.equal(
    result.indexOf(injected) >= 0,
    true,
    "Result contains injected content."
  );
  assert.end();
  reset();
});