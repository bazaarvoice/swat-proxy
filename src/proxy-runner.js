/**
 * Runs the proxy server.
 */

// Local.
import * as proxy from './proxy.js';
import { Manipulations } from './manipulations.js';

// Add some JS to the end of Home Depot's homepage:
proxy.proxy({
  targets: [
    'http://homedepot.com/',
    'http://www.homedepot.com/'
  ],
  selector: 'body',
  manipulation: Manipulations.APPEND,
  content: '<script>console.log("hello from proxy");</script>'
});

proxy.start();