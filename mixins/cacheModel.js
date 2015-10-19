/**
 * "CacheModel" mixin.
 *
 * Mixin this so the model acts like a "cache", for example the saved data can
 * disappear after a certain TTL.
 *
 * Options:
 *
 * - backend: one of the cache backends, for now there are: "redis".
 */
var debug = require('debug')('loopback:cache:CacheModel');

var lib = require('../');

module.exports = function(Model, options) {

  if (options == null) {
    options = {};
  }

  // Require a backend.
  if (options.backend == null || lib[options.backend] == null) {
    console.warn('...');
    return;
  }

  var backend = lib[options.backend];

  // Invoke backend.
  if (typeof backend === 'function') {
    backend(Model, options);
  }

};
