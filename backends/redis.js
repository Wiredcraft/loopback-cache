// Same syntax as a mixin.
module.exports = function(Model, options) {

  // Set TTL after save.
  if (options.ttl != null && options.ttl) {
    Model.observe('after save', function(ctx, next) {

      if (ctx.Model.getConnector().name !== 'redis') {
        return next(new Error('the connector should be redis'));
      }

      var redisClient = ctx.Model.getConnector().client;

      // @see http://redis.io/commands/expire.
      redisClient.expire([ctx.Model.modelName + ':' + ctx.instance.id, options.ttl], next);
    });
  }

};
