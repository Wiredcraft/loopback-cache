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
var backends = lib.backends;

module.exports = function(Model, options) {

  if (options == null) {
    options = {};
  }

  // Require a backend.
  if (options.backend == null || lib.backends[options.backend] == null) {
    console.warn('...');
    return;
  }

  //set expiration time for specific db
  switch (options.backend) {
    case 'redis':
      options.ttl *= 1000; //ms for redis
      break;
    case 'couchbase':
      options.ttl = options.ttl; //s for couchbase
      break;
    default:
      options.ttl *= 1000;
  }

  var backend = lib.backends[options.backend];

  // Invoke backend.
  if (typeof backend === 'function') {
    backend(Model, options);
  }

};
