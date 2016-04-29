/**
 * Injects.
 */

// NPM.
import cheerio from 'cheerio';

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
      // Match! Inject the content in.
      let $ = cheerio.load(html.toString('utf8'));
      $('body').append(this.proxyTargets[target]);
      result = $.html();

      // Early out, we won't match more than one target.
      break;
    }
  }

  return result;
}
