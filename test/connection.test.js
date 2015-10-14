// This test written in mocha+should.js
var should = require('./init.js');

var db;

describe('Couchbase connector', function() {

  it('can connect.', function(done) {
    db = getDataSource({}, done);
  });

  it('can connect.', function(done) {
    db.connect(done);
  });

  it('can disconnect.', function(done) {
    db.disconnect(done);
  });

  it('can connect twice the same time.', function(done) {
    db = getDataSource();
    db.connect(done);
  });

  it('can connect and disconnect.', function(done) {
    db = getDataSource();
    db.disconnect(done);
  });

});
