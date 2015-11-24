// Same syntax as a mixin.
module.exports = function(Model, options) {

  // Set TTL after save.
  if (options.ttl != null && options.ttl) {
    Model.observe('loaded', function(ctx, next) {

      if (ctx.Model.getConnector().name !== 'couchbase') {
        return next(new Error('the connector should be couchbase'));
      }

      var couchbaseClient = ctx.Model.getConnector();
      // @see http://docs.couchbase.com/developer/dev-guide-3.0/doc-expiration.html
      return couchbaseClient.connect().call('touchAsync', ctx.instance.value.id, options.ttl).then().catch(function(err) {
        return next(err);
      });
    });
  }

};
