/**
 * Entry point into swat-proxy.
 */

// Local.
var _proxy = require('./dist/proxy.js');
var _enums = require('./dist/enums.js');

module.exports = {
  Manipulations: _enums.Manipulations,
  MatchTypes: _enums.MatchTypes,
  proxy: _proxy.proxy,
  removeProxy: _proxy.removeProxy,
  start: _proxy.start
}
