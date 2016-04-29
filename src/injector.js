/**
 * Injects.
 */

// NPM.
import cheerio from 'cheerio';

// Local.
import Manipulations from './manipulations.js';

export var proxyTargets = {};

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

      let { selector, manipulation, content } = this.proxyTargets[target];
      $(selector)[manipulation](content);

      result = $.html();

      // Early out, we won't match more than one target.
      break;
    }
  }

  return result;
}
