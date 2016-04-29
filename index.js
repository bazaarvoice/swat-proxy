/** 
 * Entry point into swat-proxy.
 */

// Local.
var _proxy = require('./dist/proxy.js');
var _Manipulations = require('./dist/manipulations.js');

module.exports = {
  Manipulations: _Manipulations,
  proxy: _proxy.proxy,
  start: _proxy.start
}
