// Same syntax as a mixin.
module.exports = function(Model, options) {

  // Set TTL after save.
  if (options.ttl != null && options.ttl) {
    Model.observe('after save', function(ctx, next) {

      // TODO: fail if the connector is not "redis".
      var redisClient = ctx.Model.getConnector().client;

      // @see http://redis.io/commands/expire.
      redisClient.expire([ctx.Model.modelName + ':' + ctx.instance.id, options.ttl], next);
    });
  }

};
