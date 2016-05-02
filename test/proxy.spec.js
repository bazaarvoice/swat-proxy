// NPM.
import test from 'tape';

// Local.
import * as proxy from '../src/proxy.js';
import * as injector from '../src/injector.js';

// Members
const targetURL = 'bazaarvoice.com';
const serverHTML = new Buffer('<html><body>UNIT TEST</body></html>');
const selector = 'body';
const manipulation = 'append';
const content = '<div>injected content</div>';

function reset () {
  injector.proxyTargets = {};
}

/*
 * Test Cases.
 */
test('# proxy.spec.js', (t) => t.end());

test('#proxy Should add a single proxy target', (assert) => {
  const target = {
    targets: ['bazaarvoice.com'],
    selector: selector,
    manipulation: manipulation,
    content: content
  };
  proxy.proxy(target);

  assert.deepEqual(injector.proxyTargets, {
    "bazaarvoice.com": [{
      selector: target.selector,
      manipulation: target.manipulation,
      content: target.content
    }]
  }, 'A proxy target was added');

  assert.end();
  reset();
});

test('#proxy Should add all proxy targets', (assert) => {
  const target = {
    targets: ['bazaarvoice.com', 'google.com'],
    selector: selector,
    manipulation: manipulation,
    content: content
  };
  proxy.proxy(target);

  const expected = [{
    selector: target.selector,
    manipulation: target.manipulation,
    content: target.content
  }];
  assert.deepEqual(injector.proxyTargets, {
    "bazaarvoice.com": expected,
    "google.com": expected
  }, 'All proxy targets were added');

  assert.end();
  reset();
});

test('#proxy Should support a string target', (assert) => {
  const target = {
    targets: 'bazaarvoice.com',
    selector: selector,
    manipulation: manipulation,
    content: content
  };
  proxy.proxy(target);

  const expected = [{
    selector: target.selector,
    manipulation: target.manipulation,
    content: target.content
  }];
  assert.deepEqual(injector.proxyTargets, {
    "bazaarvoice.com": expected
  }, 'A proxy target was added');

  assert.end();
  reset();
});

test('#proxy Should add multiple proxy targets', (assert) => {
  // First call.
  const firstCall = {
    targets: targetURL,
    selector: selector,
    manipulation: manipulation,
    content: '<div>#1</div>'
  };
  proxy.proxy(firstCall);

  // Second call.
  const secondCall = {
    targets: targetURL,
    selector: selector,
    manipulation: manipulation,
    content: '<div>#2</div>'
  };
  proxy.proxy(secondCall);

  assert.deepEqual(injector.proxyTargets, {
    "bazaarvoice.com": [{
      selector: firstCall.selector,
      manipulation: firstCall.manipulation,
      content: firstCall.content
    }, {
      selector: secondCall.selector,
      manipulation: secondCall.manipulation,
      content: secondCall.content
    }]
  }, 'All proxy targets were added');

  assert.end();
  reset();
});
