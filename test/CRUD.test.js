var should = require('./init.js');

var db, Person;

describe('json-parsing', function() {

    before(function() {
        db = getDataSource();
        Person = db.createModel('person', {id: Number, name: String, age: Number});
    });

    it('create test case 1', function(done) {
        Person.create({
          id: '2',
          name: 'Mary',
          age: 34
        }, function(err, res) {
          if(err) console.log(err);
          Person.find({id: '2'},function(err, res) {
            res.id.should.eql(2);
            res.name.should.eql('Mary');
            res.age.should.eql(34);
            console.log(res);
          })
          done(err, res);
        });
    });

});
