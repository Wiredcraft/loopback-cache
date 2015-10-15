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
        var self = this;
        Person.findById('2',function(err, res) {
          res.id.should.equal(2);
          res.name.should.equal('Mary');
          res.age.should.equal(34);
          done(err, res);
        })
      });
    });

    it('mixin test case 1', function(done) {
      var config = {
        ttl: 3  //seconds
      };
      mixin(Person,config);

      Person.create({
        id: 3,
        name: 'Charlie',
        age: 24
      }, function(err, res) {
        if(err) console.log(err);
        setTimeout(function(){
          Person.findById('3',function(err, res) {
            should.not.exist(res.id);
            done(err, res);
          });
        },config.ttl*1000);
      });
    });

});
