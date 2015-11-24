// Same syntax as a mixin.
module.exports = function(Model, options) {

  // Set TTL after save.
  if (options.ttl != null && options.ttl) {
    Model.observe('before save', function(ctx, next) {

      if (ctx.Model.getConnector().name !== 'couchbase') {
        return next(new Error('the connector should be couchbase'));
      }

      ctx.options.expiry = options.ttl;  //s
      next();
    });
  }

};
