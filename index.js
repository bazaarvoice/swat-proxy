/**
 * Entry point into swat-proxy.
 */

// Local.
var _proxy = require('./dist/proxy.js');
var _manipulations = require('./dist/manipulations.js');

module.exports = {
  Manipulations: _manipulations.Manipulations,
  proxy: _proxy.proxy,
  start: _proxy.start
}
