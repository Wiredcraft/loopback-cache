var util = require('util');

// Same syntax as a mixin.
module.exports = function (Model, options) {

  if (options.ttl != null && options.ttl) {
    // Set TTL after save.
    Model.observe('after save', function (ctx, next) {
      // @see https://github.com/strongloop/loopback-connector-redis
      if (ctx.Model.getConnector().name === 'redis') {
        var client = ctx.Model.getConnector().client;
        var key = util.format('%s:%s', ctx.Model.modelName, ctx.instance.id);
        // @see http://redis.io/commands/expire.
        return client.expire([key, options.ttl], next);
      }
      // Nothing else supported for now.
      next();
    });
  }

};
