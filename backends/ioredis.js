var util = require('util');

// Same syntax as a mixin.
module.exports = function(Model, options) {

  if (options.ttl != null && options.ttl) {
    // Set TTL after save.
    Model.observe('after save', function(ctx, next) {
      // @see https://github.com/wiredcraft/loopback-connector-ioredis
      if (ctx.Model.getConnector().name === 'ioredis') {
        var client = ctx.Model.getConnector().connect();
        var key = util.format('%s:%s', ctx.Model.modelName, ctx.instance.id);
        // @see http://redis.io/commands/expire.
        client.call('expire', [key, options.ttl]).asCallback(next);
      }
      // Nothing else supported for now.
      next();
    });
  }

};
