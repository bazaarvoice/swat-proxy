/**
 * Provides a logger that must be turned on first.
 */

// Members.
let shouldLog = false;

/**
 * Turns on logging.
 */
export function enableLogging () {
  shouldLog = true;
}

/**
 * Logs to the console only if logging has previously been turned on.
 *
 * @param  {String} msg - The message to log to the console.
 */
export function log (msg) {
  if (shouldLog) {
    console.log(msg);
  }
}
