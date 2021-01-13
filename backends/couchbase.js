'use strict';

const { isCouchbaseVersionSupported, calculateExpiry } = require('../utils/couchbase');
/**
 * Same syntax as a mixin.
 */
module.exports = function(Model, options) {
  if (options.ttl != null && options.ttl) {
    // Set TTL before save.
    Model.observe('before save', function(ctx, next) {
      const connectorName = ctx.Model.getConnector().name;
      if (isCouchbaseVersionSupported(connectorName)) {
        ctx.options.expiry = calculateExpiry(options.ttl);
        return next();
      }
      // Nothing else supported for now.
      next();
    });
  }
};
