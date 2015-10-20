// Same syntax as a mixin.
module.exports = function(Model, options) {

  // Set TTL after save.
  if (options.ttl != null && options.ttl) {
    Model.observe('after save', function(ctx, next) {

      if (ctx.Model.getConnector().name !== 'redis') {
        next(new Error('the connector should be redis'));
      } else {
        var redisClient = ctx.Model.getConnector().client;

        // @see http://redis.io/commands/expire.
        redisClient.expire([ctx.Model.modelName + ':' + ctx.instance.id, options.ttl], next);
      }
    });
  }

};
