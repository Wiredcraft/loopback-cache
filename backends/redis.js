// Same syntax as a mixin.
module.exports = function(Model, options) {

  // Set TTL after save.
  if (options.ttl != null && options.ttl) {
    // Assuming the Model connector is "redis" here but we may need a config in
    // the future.

    Model.observe('after save', function(ctx, next) {
      // @see http://redis.io/commands/expire.
      var redisClient = ctx.Model.getConnector().client;
      //pass arguments as array
      redisClient.expire([ctx.Model.modelName+":"+ctx.instance.id, options.ttl],function(err,res){
        if(err) console.log(err);
      });
      next();
    });
  }

};
