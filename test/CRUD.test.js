var should = require('./init.js');
var mixin = require('../').redis
var db, Person;

describe('json-parsing', function() {

    before(function() {
        db = getDataSource();
        Person = db.createModel('person', {id: Number, name: String, age: Number});
    });

    it('create test case 1', function(done) {
      Person.create({
        id: 2,
        name: 'Mary',
        age: 34
      }, function(err, res) {
        if(err) console.log(err);
        Person.find({id: 2},function(err, res) {
          res.id.should.eql(2);
          res.name.should.eql('Mary');
          res.age.should.eql(34);
        })
        done(err, res);
      });
    });

    it('mixin test case 1', function(done) {
      var config = {
        ttl: 20  //seconds
      };
      mixin(Person,config);

      Person.create({
        id: 3,
        name: 'Charlie',
        age: 24
      }, function(err, res) {
        if(err) console.log(err);

        Person.find({id: 3},function(err, res) {
          res.id.should.eql(3);
          res.name.should.eql('Charlie');
          res.age.should.eql(24);
        })

        done(err, res);
      });

    });

});
