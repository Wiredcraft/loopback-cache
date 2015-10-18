var should = require('./init.js');
var mixin = require('../').redis
var db, Person, config;

describe('json-parsing', function() {

    before(function() {
        db = getDataSource();
        Person = db.createModel('person', {id: Number, name: String, age: Number});
        persons = [
          {
            id: 1,
            name: 'Mary',
            age: 34
          },
          {
            id: 2,
            name: 'Charlie',
            age: 24
          }
        ];
        config = {
          ttl: 3  //seconds
        };
    });

    it('create should create new item', function(done) {
      return Person.create(persons[0]).then(function(res) {
        res.name.should.eql('Mary');
        done();
      }).catch(function(err){
        done(err);
      });
    });

    it('create should create new item with mixin EXPIRE in 3s', function(done) {
      mixin(Person,config);
      return Person.create(persons[1]).then(function(res){
        res.name.should.eql('Charlie');
        setTimeout(function(){
          return Person.findById('3').then(function(res){
            should.not.exist(res.id);
            done();
          }).catch(function(err){
            done(err);
          });
        },config.ttl*1000);
      }).catch(function(err){
        done(err);
      });
    });

});
