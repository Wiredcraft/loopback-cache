// Same syntax as a mixin.
module.exports = function(Model, options) {

  // Set TTL after save.
  if (options.ttl != null && options.ttl) {
    Model.observe('after save', function(ctx, next) {

      if (ctx.Model.getConnector().name !== 'redis') {
        return next(new Error('the connector should be redis'));
      }

      var redisClient = ctx.Model.getConnector().client;
      var modelName = ctx.Model.modelName;
      var modelID = ctx.instance.id;
      var expirationTime = options.ttl;  //s

      // @see http://redis.io/commands/expire.
      redisClient.expire([modelName + ':' + modelID, expirationTime], next);
    });
  }

};
