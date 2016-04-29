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
 * @param {Object}  options - Required options.
 *
 * @param {Array}   options.targets - A list of strings to test URLs against.
 *   If the URL matches exactly, options.content will be injected into the response.
 *
 * @param {String}  options.selector - The cheerio selector to use.
 *   @see https://github.com/cheeriojs/cheerio#selectors
 *
 * @param {String}  options.manipulation - The cheerio manipulation method to use.
 *   @see manipulations.js.
 *
 * @param {String}  options.content - The HTML / CSS / JS content to inject.
 */
export function proxy (options) {
  // Grab the values from options via destructuring.
  let { targets, selector, manipulation, content } = options;

  // Targets: Ensure an array.
  targets = [].concat(targets);

  // Add all of the desired targets.
  for (let target of targets) {
    injector.proxyTargets[target] = {
      selector: selector,
      manipulation: manipulation,
      content: content
    };  
  }
}

/**
 * Creates and starts the proxy server.
 *
 * @param {Number} port - The port to start the proxy server on.
 *                        Defaults to 8063.
 */
export function start (port) {
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
  const realPort = port || PORT;
  console.log(`Proxy server listening on port ${realPort}.`);
  proxyServer.listen(realPort);
}
