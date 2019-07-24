'use strict';

var convertToAbsExpiry = function(ttl) {
  return Math.floor(Date.now() / 1000) + ttl;
};

/**
 * Same syntax as a mixin.
 */
module.exports = function(Model, options) {

  if (options.ttl != null && options.ttl) {
    // Set TTL before save.
    Model.observe('before save', function(ctx, next) {
      // @see https://github.com/Wiredcraft/loopback-connector-couchbase3
      if (/^couchbase[35]$/.test(ctx.Model.getConnector().name)) {
        // @see http://docs.couchbase.com/sdk-api/couchbase-node-client-2.1.2/Bucket.html#touch
        if (options.ttl > 30 * 24 * 60 * 60) {
          ctx.options.expiry = convertToAbsExpiry(options.ttl);
        } else {
          ctx.options.expiry = options.ttl;
        }
        return next();
      }
      // Nothing else supported for now.
      next();
    });
  }

};
