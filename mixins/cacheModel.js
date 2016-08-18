'use strict';

/**
 * `CacheModel` mixin.
 *
 * Mixin this so the model acts like a "cache", for example the saved data can
 * disappear after a certain TTL.
 *
 * Options:
 * - `backend` One of the cache backends.
 *
 * Built in backends:
 * - `redis`
 * - `ioredis`
 * - `couchbase`
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

  var backend = lib.backends[options.backend];

  // Invoke backend.
  if (typeof backend === 'function') {
    backend(Model, options);
  }

};
