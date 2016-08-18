var should = require('should');
var mixin = require('../mixins/cacheModel');
var DataSource = require('loopback-datasource-juggler').DataSource;

describe('Redis backend', function() {
  var db;
  var Person;
  var id;
  var connector;

  before(function() {
    db = new DataSource(require('loopback-connector-redis'));
    connector = db.connector;
    Person = db.createModel('person', {
      id: String,
      name: String
    });
    mixin(Person, {
      backend: 'redis',
      ttl: 2 //s
    });
  });

  after(function(done) {
    connector.client.flushall(done);
  });

  it('can create a new item', function() {
    return Person.create({
      name: 'Lorem'
    }).then(function(person) {
      person.should.be.Object();
      person.name.should.equal('Lorem');
      id = person.id;
    });
  });

  it('can load the item', function() {
    return Person.findById(id).then(function(person) {
      person.should.be.Object();
      person.name.should.equal('Lorem');
    });
  });

  it('cannot load something not there', function() {
    return Person.findById(999).then(function(person) {
      person.should.be.Object();
      should(person.id).be.undefined();
      should(person.name).be.undefined();
    });
  });

  it('cannot load the item after 3 seconds', function(done) {
    setTimeout(function() {
      Person.findById('lorem').then(function(person) {
        person.should.be.Object();
        should(person.id).be.undefined();
        should(person.name).be.undefined();
        done();
      }).catch(done);
    }, 3000);
  });
});

describe('Redis backend with IORedis connector', function() {
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
      backend: 'redis',
      ttl: 2 //s
    });
  });

  after(function() {
    return connector.connect().call('flushall');
  });

  it('can create a new item', function() {
    return Person.create({
      name: 'Lorem'
    }).then(function(person) {
      person.should.be.Object();
      person.name.should.equal('Lorem');
      id = person.id;
    });
  });

  it('can load the item', function() {
    return Person.findById(id).then(function(person) {
      person.should.be.Object();
      person.name.should.equal('Lorem');
    });
  });

  it('cannot load something not there', function() {
    return Person.findById(999).then(function(person) {
      should.not.exist(person);
    });
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
