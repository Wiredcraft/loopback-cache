var should = require('should');
var mixin = require('../mixins/cacheModel');
var DataSource = require('loopback-datasource-juggler').DataSource;

describe('Redis backend', function() {
  var db;
  var Person;
  var id;

  before(function() {
    db = new DataSource(require('loopback-connector-redis'));
    Person = db.createModel('person', {
      id: String,
      name: String
    });
    mixin(Person, {
      backend: 'redis',
      ttl: 2 //s
    });
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
      person.should.be.Object();
      should(person.id).be.undefined();
      should(person.name).be.undefined();
      done();
    }).catch(done);
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
