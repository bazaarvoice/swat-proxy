/**
 * Runs the proxy server.
 */

// Local.
import * as proxy from './proxy.js';
import { Manipulations } from './manipulations.js';

// Add the container div to the designated area.
proxy.proxy({
  targets: [
    'http://homedepot.com/',
    'http://www.homedepot.com/'
  ],
  selector: '#container',
  manipulation: Manipulations.PREPEND,
  content: '<div id="BVModuleNameContainer"></div>'
});

// Add the JS that populates the div to the end of the body.
proxy.proxy({
  targets: [
    'http://homedepot.com/',
    'http://www.homedepot.com/'
  ],
  selector: 'body',
  manipulation: Manipulations.APPEND,
  content: '<script>document.getElementById("BVModuleNameContainer").innerHTML = "hello from BV!";</script>'
});

// Start the proxy server.
proxy.start();