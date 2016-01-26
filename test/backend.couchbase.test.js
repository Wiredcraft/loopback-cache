var should = require('should');
var mixin = require('../mixins/cacheModel');
var DataSource = require('loopback-datasource-juggler').DataSource;

describe('Couchbase backend', function () {
  var db;
  var Person;
  var id;

  before(function () {
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

  after(function (done) {
    db.connector.manager().call('flushAsync').then(function () {
      done();
    }, done);
  });

  it('can create a new item', function (done) {
    return Person.create({
      name: 'Lorem'
    }).then(function (person) {
      person.should.be.Object();
      person.id.should.be.String();
      person.name.should.equal('Lorem');
      id = person.id;
      done();
    }).catch(done);
  });

  it('can load the item', function (done) {
    Person.findById(id).then(function (person) {
      person.should.be.Object();
      person.id.should.equal(id);
      person.name.should.equal('Lorem');
      done();
    }).catch(done);
  });

  it('cannot load something not there', function (done) {
    Person.findById('ipsum').then(function () {
      done(new Error('expected an error'));
    }, function (err) {
      should.exist(err);
      done();
    });
  });

  it('cannot load the item after 3 seconds', function (done) {
    setTimeout(function () {
      Person.findById(id).then(function () {
        done(new Error('expected an error'));
      }, function (err) {
        should.exist(err);
        done();
      });
    }, 3000);
  });
});
