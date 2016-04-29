// NPM.
import test from 'tape';

// Local.
import * as injector from '../src/injector.js';
import { Manipulations } from '../src/manipulations.js';

/*
 * Test Setup Helpers.
 */
// Restores the module to its initial state.
function reset () {
  injector.proxyTargets = {};
}

/*
 * Test Cases.
 */
test('# injector.spec.js', (t) => t.end());

test('Should alter response when target matches.', (assert) => {
  // Setup: Proxy target does match URL.
  const targetURL = 'bazaarvoice.com';
  const serverHTML = new Buffer('<html><body>html</body></html>');
  const injection = 'value';

  injector.proxyTargets[targetURL] = {
    selector: 'body',
    manipulation: Manipulations.APPEND,
    content: injection
  };
  const result = injector.injectInto(targetURL, serverHTML);

  assert.equal(
    result.indexOf(injection) >= 0,
    true,
    "Result contains injected content."
  );
  assert.end();
  reset();
});

test('Should not alter response when no target matches.', (assert) => {
  // Setup: Proxy target does not match URL.
  const serverHTML = 'html';
  injector.proxyTargets = { 'aol.com': {}};
  const result = injector.injectInto('google.com', serverHTML);

  assert.equal(result, serverHTML);
  assert.end();
  reset();
});
