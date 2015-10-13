// Same syntax as a mixin.
module.exports = function(Model, options) {

  // Set TTL after save.
  if (options.ttl != null && options.ttl) {
    // Assuming the Model connector is "redis" here but we may need a config in
    // the future.
    Model.observe('after save', function(ctx, next) {
      // @see http://redis.io/commands/expire.
      // TODO
      next();
    });
  }

};
