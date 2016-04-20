var should = require('should');
var mixin = require('../mixins/cacheModel');
var DataSource = require('loopback-datasource-juggler').DataSource;

describe('IORedis backend', function() {
  var db;
  var Person;
  var id;
  var connector;

  before(function() {
    db = new DataSource(require('loopback-connector-ioredis'));
    connector = db.connector;
    Person = db.createModel('person', {
      id: String,
      name: String
    });
    mixin(Person, {
      backend: 'ioredis',
      ttl: 2 //s
    });
  });

  after(function(done) {
    connector.connect().call('flushall').then(function() {
      done();
    }, done);
  });

  it('can create a new item', function(done) {
    return Person.create({
      name: 'Lorem'
    }).then(function(person) {
      person.should.be.Object();
      person.name.should.equal('Lorem');
      id = person.id;
      done();
    }).catch(done);
  });

  it('can load the item', function(done) {
    Person.findById(id).then(function(person) {
      person.should.be.Object();
      person.name.should.equal('Lorem');
      done();
    }).catch(done);
  });

  it('cannot load something not there', function(done) {
    Person.findById(999).then(function(person) {
      should.not.exist(person);
      done();
    }).catch(done);
  });

  it('cannot load the item after 3 seconds', function(done) {
    setTimeout(function() {
      Person.findById('lorem').then(function(person) {
        should.not.exist(person);
        done();
      }).catch(done);
    }, 3000);
  });
});
