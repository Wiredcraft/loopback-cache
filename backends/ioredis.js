'use strict';

var util = require('util');

/**
 * Same syntax as a mixin.
 *
 * @deprecated Use the `redis` backend which supports both the `redis` and `ioredis` connectors.
 */
module.exports = function(Model, options) {

  if (options.ttl != null && options.ttl) {
    // Set TTL after save.
    Model.observe('after save', function(ctx, next) {
      const connector = ctx.Model.getConnector();
      // @see https://github.com/Wiredcraft/loopback-connector-ioredis
      if (connector.name === 'ioredis') {
        var key = util.format('%s:%s', ctx.Model.modelName, ctx.instance.id);
        // @see http://redis.io/commands/expire.
        return connector.connect().call('expire', [key, options.ttl]).asCallback(next);
      }
      // Nothing else supported for now.
      next();
    });
  }

};
