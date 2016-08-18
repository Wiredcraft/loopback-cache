var should = require('should');
var mixin = require('../mixins/cacheModel');
var DataSource = require('loopback-datasource-juggler').DataSource;

describe('Couchbase backend', function() {
  var db;
  var Person;
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
      }
    });
    Person = db.createModel('person', {
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
});
