/**
 * Entry point into swat-proxy.
 */

// Local.
var _proxy = require('./dist/proxy.js');
var _manipulations = require('./dist/manipulations.js');

module.exports = {
  Manipulations: _manipulations.Manipulations,
  MatchTypes: _manipulations.MatchTypes,
  proxy: _proxy.proxy,
  removeProxy: _proxy.removeProxy,
  start: _proxy.start
}
