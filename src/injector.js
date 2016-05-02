/**
 * Injects.
 */

// NPM.
import cheerio from 'cheerio';

// Local.
import { Manipulations } from './manipulations.js';

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
 * @return {String}      - HTML with contents injected.
 */
export function injectInto (url, html) {
  let result = html;

  for (let target of Object.keys(this.proxyTargets)) {
    if (target === url) {
      // Match! Inject the content in where desired.
      let $ = cheerio.load(html.toString('utf8'));

      // Possibly inject more than one thing into this page.
      for (let targetOption of this.proxyTargets[target]) {
        let { selector, manipulation, content } = targetOption;

        // Actually do the injection of this content.
        $(selector)[manipulation](content);
      }

      // The result is the HTML after all the contents have been injected.
      result = $.html();

      // Early out, we won't match more than one target.
      break;
    }
  }

  return result;
}
