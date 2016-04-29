/**
 * Runs the proxy server.
 */

// Local.
import * as proxy from './proxy.js';

// Go time.
// Ends with homedepot.com.
proxy.proxy([
    'http://homedepot.com/',
    'http://www.homedepot.com/'
  ],
  '<script>console.log("hello from proxy");</script>'
);
proxy.start();