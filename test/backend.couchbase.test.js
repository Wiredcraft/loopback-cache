var should = require('should');
var mixin = require('../mixins/cacheModel');
var DataSource = require('loopback-datasource-juggler').DataSource;

describe('Couchbase backend', function() {
  var ttl3m = 90 * 24 * 60 * 60;
  var expiry = Math.floor(Date.now() / 1000) + ttl3m;
  var db;
  var Person;
  var Staff;
  var id;

  before(function() {
    db = new DataSource(require('loopback-connector-couchbase3'), {
      cluster: {
        url: 'couchbase://localhost',
        options: {}
      },
      bucket: {
        name: 'test_bucket',
        password: ''
      },
      designDocs: {
        find: {
          views: {
            getExpiry: { map: `function(e,m){e._type&&emit(m.expiration)}` }
          }
        }
      }
    });
    Person = db.createModel('person', {
      id: {
        type: String,
        id: true
      },
      name: String
    });
    Staff = db.createModel('staff', {
      id: {
        type: String,
        id: true
      },
      name: String
    });
    mixin(Person, {
      backend: 'couchbase',
      ttl: 2 //s
    });
    mixin(Staff, {
      backend: 'couchbase',
      ttl: ttl3m // 3 months
    });
  });

  before(function() {
    return db.autoupdate();
  });

  after(function() {
    return db.connector.manager().call('flushAsync');
  });

  it('can create a new item', function() {
    return Person.create({
      name: 'Lorem'
    }).then(function(person) {
      person.should.be.Object();
      person.id.should.be.String();
      person.name.should.equal('Lorem');
      id = person.id;
    });
  });

  it('can load the item', function() {
    return Person.findById(id).then(function(person) {
      person.should.be.Object();
      person.id.should.equal(id);
      person.name.should.equal('Lorem');
    });
  });

  it('cannot load something not there', function() {
    return Person.findById('ipsum').then(function(person) {
      should.not.exist(person);
    });
  });

  it('cannot load the item after 3 seconds', function(done) {
    setTimeout(function() {
      Person.findById(id).then(function(person) {
        should.not.exist(person);
        done();
      }).catch(done);
    }, 3000);
  });

  it('TTL larger than 30 days will be converted epoch time', function() {
    return Staff.create({
      name: 'Staff'
    }).then(function(sta) {
      return db.connector.view('find', 'getExpiry').then(function(res) {
        var staff = res.find(function(item) {
          return item.id = sta.id;
        });
        staff.should.be.Object();
        staff.key.should.be.approximately(expiry, 10);
      });
    });
  });
});
