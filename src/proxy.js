/**
 * Creates a proxy server.
 */

// Core.
import http from 'http';

// NPM.
import request from 'request';

// Local.
import * as injector from './injector.js';

// Members.
const PORT = 8063;

/**
 * Adds a proxy target.
 *
 * @param {Array} targets   - A list of strings to test URLs against.
 *                          If the URL matches exactly, 'contents' will be
 *                          injected into the response.
 * @param {String} contents - The HTML / CSS / JS contents to inject.
 */
export function proxy (targets, contents) {
  // Convert single string to array.
  targets = [].concat(targets);

  // Add all of the desired targets.
  for (let target of targets) {
    injector.proxyTargets[target] = contents;  
  }
}

/**
 * Creates and starts the proxy server.
 */
export function start () {
  let proxyServer = http.createServer((clientRequest, clientResponse) => {
    clientRequest.pause();

    // Actually make the request to the desired endpoint to get the initial HTML.
    request({
      url: clientRequest.url,
      encoding: null
    }, (err, response, endpointHTML) => {
      // Possibly inject things into this response.
      let alteredResponse = endpointHTML;

      if (endpointHTML) {
        alteredResponse = injector.injectInto(clientRequest.url, endpointHTML);
      }

      // Send the possibly modified response back to the client.
      clientResponse.end(alteredResponse);
    });

    clientRequest.resume();
  });

  // Start the proxy server.
  console.log(`Proxy server listening on port ${PORT}.`);
  proxyServer.listen(PORT);
}
