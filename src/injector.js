/**
 * Injects.
 */

// NPM.
import cheerio from 'cheerio';

// Local.
import * as logger from './logger.js';

/**
 * proxyTargets define what to inject for each URL match.
 *
 * A proxyTarget object looks like this:
 * {
 *   "homedepot.com": [{
 *     selector: "body",
 *     manipulation: Manipulations.APPEND,
 *     content: "<div>hello world</div>"
 *   }]
 * }
 */
export var proxyTargets = {};

/**
 * Adds a proxyTarget to the internal store.
 *
 * @param {String} target  - The URL to match.
 * @param {Object} options - Required options.
 *
 * @param {String} options.selector - The cheerio selector.
 *                 @see  https://github.com/cheeriojs/cheerio#selectors
 *
 * @param {String} options.manipulation -  The swat-proxy manipulation.
 *                 @see  ./manipulations.js
 *
 * @param {String} options.content - The actual content to inject.
 *
 * @returns {void}
 */
export function addProxyTarget (target, options) {
  if (!this.proxyTargets[target]) {
    // This target does not exist, create it.
    this.proxyTargets[target] = [options];
  }
  else {
    // This target already exists, add to it.
    this.proxyTargets[target].push(options);
  }
}

/**
 * Inject content into matching proxyTargets.
 *
 * @param  {String} url  - The client requested URL.
 * @param  {Buffer} html - The server response HTML in a Buffer.
 *
 * @returns {String}     - HTML with contents injected.
 */
export function injectInto (url, html) {
  let result = html;

  if (this.proxyTargets[url]) {
    logger.log('Found a match! Injecting content.');

    // Match! Inject the content in where desired.
    let $ = cheerio.load(html.toString('utf8'));

    // Possibly inject more than one thing into this page.
    for (let targetOption of this.proxyTargets[url]) {
      let { selector, manipulation, content } = targetOption;

      // Actually do the injection of this content.
      $(selector)[manipulation](content);
    }

    // The result is the HTML after all the contents have been injected.
    result = $.html();
  }

  return result;
}
