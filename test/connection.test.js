// This test written in mocha+should.js
var should = require('./init.js');

var db;

describe('Redis connection', function() {

  it('can connect.', function(done) {
    db = getDataSource('loopback-connector-redis', {}, done);
  });

  it('can connect.', function(done) {
    db.connect(done);
  });

  it('can disconnect.', function(done) {
    db.disconnect(done);
  });

  it('can connect twice the same time.', function(done) {
    db = getDataSource('loopback-connector-redis');
    db.connect(done);
  });

  it('can connect and disconnect.', function(done) {
    db = getDataSource('loopback-connector-redis');
    db.disconnect(done);
  });

});

describe('Couchbase connector', function() {

  it('can connect.', function(done) {
    db = getDataSource('loopback-connector-couchbase3', {}, done);
  });

  it('can connect.', function(done) {
    db.connect(done);
  });

  it('can disconnect.', function(done) {
    db.disconnect(done);
  });

  it('can connect twice the same time.', function(done) {
    db = getDataSource('loopback-connector-couchbase3');
    db.connect(done);
  });

  it('can connect and disconnect.', function(done) {
    db = getDataSource('loopback-connector-couchbase3');
    db.disconnect(done);
  });

});
