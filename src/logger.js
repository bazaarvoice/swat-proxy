/**
 * Provides a console logger that must be turned on first.
 */

// Members.
let shouldLog = false;

/**
 * Turns on logging.
 *
 * @returns {void}
 */
export function enableLogging () {
  shouldLog = true;
}

/**
 * Logs to the console only if logging has previously been turned on.
 *
 * @param  {String} msg - The message to log to the console.
 *
 * @returns {void}
 */
export function log (msg) {
  if (shouldLog) {
    console.log(msg); // eslint-disable-line no-console
  }
}
