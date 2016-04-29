/**
 * Runs the proxy server.
 */

// Local.
import * as proxy from './proxy.js';
import Manipulations from './manipulations.js';

// Go time.
// Ends with homedepot.com.
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