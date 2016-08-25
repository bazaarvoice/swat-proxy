/**
 * Creates a proxy server.
 */

// Core.
import http from 'http';

// NPM.
import request from 'request';

// Local.
import * as injector from './injector';
import * as logger from './logger';
import { MatchTypes } from './manipulations';

// Members.
const DEFAULT_PORT = 8063;
const ERROR_MISSING_PARAMS = 'Missing one or more required parameters';

/**
 * Adds a proxy target.
 *
 * @param {String}  target  - A string to test URLs against.
 *   If the URL matches exactly, options.content will be injected into the response.
 *
 * @param {Object | Array}  options - Required options or list of options.
 *
 * @param {String}  options.selector - The cheerio selector to use.
 *   @see https://github.com/cheeriojs/cheerio#selectors
 *
 * @param {String}  options.manipulation - The cheerio manipulation method to use.
 *   @see manipulations.js.
 *
 * @param {String}  options.content - The HTML / CSS / JS content to inject.
 *
 * @returns {void}
 */
export function proxy (target, options) {
  // A target is required.
  if (!target) {
    throw new Error(`${ERROR_MISSING_PARAMS}: 'url'`);
  }

  // If there's a trailing slash on the target, trim it
  if (target[target.length-1] === '/') {
    target = target.substring(0, target.length-1);
  }

  // Lowercase our target url for storage
  target = target.toLowerCase();

  const defaultMatchType = MatchTypes.EXACT;

  // Ensure that options is an array.
  options = [].concat(options);
  const missingOptions = [];

  for (let optionEntry of options) {
    if (!optionEntry.selector) {
      missingOptions.push('selector');
    }
    if (!optionEntry.manipulation) {
      missingOptions.push('manipulation');
    }
    if (!optionEntry.content) {
      missingOptions.push('content');
    }

    optionEntry.matchType = optionEntry.matchType || defaultMatchType;

    // All options parameters are required.
    if (missingOptions.length) {
      throw new Error(`${ERROR_MISSING_PARAMS}: '${missingOptions.join('\', \'')}'`);
    }

    // Add the desired proxy target.
    injector.addProxyTarget(target, optionEntry);
  }
}

/**
 * Creates and starts the proxy server.
 *
 * @param {Object}  options - Optional options.
 *
 * @param {Number}  options.port - The port to start the proxy server on.
 *                               Defaults to 8063.
 *
 * @param {Boolean} options.debugMode - Enables logging to help debug problems.
 *
 * @returns {void}
 */
export function start (options) {
  // Enable the logger if requested to do so.
  if (options && !!options.debugMode) {
    logger.enableLogging();
  }

  let proxyServer = http.createServer((clientRequest, clientResponse) => {
    clientRequest.pause();

    logger.log(`Making a request to ${clientRequest.url}.`);

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

      // Preserve the server headers.
      for (let header in response.headers) {
        clientResponse.setHeader(header, response.headers[header]);
      }

      // Send the possibly modified response back to the client.
      clientResponse.end(alteredResponse);
    });

    clientRequest.resume();
  });

  // Start the proxy server.
  const realPort = (options && options.port) ? options.port : DEFAULT_PORT;
  console.log(`Proxy server listening on port ${realPort}.`); //eslint-disable-line no-console
  proxyServer.listen(realPort);
}
