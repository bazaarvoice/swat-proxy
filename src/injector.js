/**
 * Injects.
 */

// Node.
import urlParser from 'url';

// NPM.
import cheerio from 'cheerio';

// Local.
import * as logger from './logger';
import { MatchTypes } from './enums';
import { trimSlash } from './utils';

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
export var proxyTargets = new Map();

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
 *                 @see  ./enums.js
 *
 * @param {String | Function} options.content - The actual content to inject, or a
 *   function that receives the element's markup and returns transformed markup.
 *
 *
 * @returns {void}
 */
export function addProxyTarget (target, options) {
  if (!this.proxyTargets.has(target)) {
    // This target does not exist, create it.
    this.proxyTargets.set(target, new Set());
  }

  this.proxyTargets.get(target).add(options);
}

/**
 * Removes a proxyTarget from the internal store.
 *
 * @param {String} target  - The URL to match.
 * @param {Object} [options] - Optional options (must match by reference).
 *
 * @returns {void}
 */
export function removeProxyTarget (target, options) {
  if (this.proxyTargets.has(target)) {
    const optionSet = this.proxyTargets.get(target);

    if (options) {
      if (optionSet.has(options)) {
        optionSet.delete(options);
      }
    }
    else {
      this.proxyTargets.delete(target);
    }
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
  // Lowercase the url for comparison
  url = trimSlash(url.toLowerCase());

  // Precalculate our url vars in case there are multiple PREFIX
  // matchTypes in the loop below that would cause multiple calculations
  const parsedUrl = urlParser.parse(url);
  const urlComparator = `${parsedUrl.protocol}//${parsedUrl.host}${parsedUrl.path}`;

  // Lookup hash for matchType processors
  const matchTypeMap = {
    // Domain matches only need to verify the hostname portion of each url
    [MatchTypes.DOMAIN]: (targetUrl) => {
      const parsedTargetUrl = urlParser.parse(targetUrl);

      return parsedTargetUrl.hostname === parsedUrl.hostname;
    },

    // Exact matches verify the full url of both the current request and the target
    [MatchTypes.EXACT]: (targetUrl) => {
      return targetUrl === url;
    },

    // Prefix matching only cares that our current request url
    // starts with the target's protocol/hostname/port/path/query
    [MatchTypes.PREFIX]: (targetUrl) => {
      return urlComparator.startsWith(targetUrl);
    }
  };

  let result = html;
  let changed = false;
  const $ = cheerio.load(html.toString('utf8'));

  for (let key of this.proxyTargets.keys()) {
    const optionSet = this.proxyTargets.get(key);

    for (let options of optionSet) {
      // Each option hash in the set can have its own separate matchType, so
      // we only process them when their matchType processor passes its test
      if (matchTypeMap[options.matchType](key)) {
        changed = true;
        logger.log('Found a match! Injecting content.');

        // Match! Inject the content in where desired.
        let { selector, manipulation, content } = options;

        // Actually do the injection of this content.
        if (typeof content === 'function') {
          // Iterate over each match
          $(selector).each((i, elem) => {
            // Invoke our content function for each element, passing its html
            // and assign the result of that call as the manipulated content.
            $(elem)[manipulation](content($.html(elem)));
          });
        }
        else {
          // Apply string content to all matched nodes
          $(selector)[manipulation](content);
        }
      }
    }
  }

  if (changed) {
    // The result is the HTML after all the contents have been injected.
    result = $.html();
  }

  return result;
}
