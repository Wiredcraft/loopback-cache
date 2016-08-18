'use strict';

/**
 * Same syntax as a mixin.
 */
module.exports = function(Model, options) {

  if (options.ttl != null && options.ttl) {
    // Set TTL before save.
    Model.observe('before save', function(ctx, next) {
      // @see https://github.com/Wiredcraft/loopback-connector-couchbase3
      if (ctx.Model.getConnector().name === 'couchbase3') {
        // @see http://docs.couchbase.com/sdk-api/couchbase-node-client-2.1.2/Bucket.html#touch
        ctx.options.expiry = options.ttl;
        return next();
      }
      // Nothing else supported for now.
      next();
    });
  }

};
