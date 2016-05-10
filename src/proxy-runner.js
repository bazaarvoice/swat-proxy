/**
 * Runs the proxy server.
 */

// Local.
import * as proxy from './proxy.js';
import { Manipulations } from './manipulations.js';

const url = 'https://www.att.com/cellphones/samsung/galaxy-s-5.html#sku=sku7120234';

// Add the container div to the designated area.
proxy.proxy(url, {
  selector: 'body',
  manipulation: Manipulations.APPEND,
  content: '<div id="BVModuleNameContainer"></div>'
});

// Add the JS that populates the div to the end of the body.
proxy.proxy(url, {
  selector: 'body',
  manipulation: Manipulations.APPEND,
  content: '<script>document.getElementById("BVModuleNameContainer").innerHTML = "hello from BV!";</script>'
});

// Start the proxy server.
proxy.start({
  debugMode: true
});