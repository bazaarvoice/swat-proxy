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

  for (let target of Object.keys(proxyTargets)) {
    if (target === url) {
      console.log('Match. Proxy server injecting content into', url);
      console.log('The content is', proxyTargets[target]);

      // Match! Inject the content in.
      let $ = cheerio.load(html.toString('utf8'));
      $('body').append(proxyTargets[target]);
      result = $.html();

      // Early out, we won't match more than one target.
      break;
    }
  }

  //console.log('The result is', result.substring(20));
  return result;
}
