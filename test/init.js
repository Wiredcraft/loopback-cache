module.exports = require('should');

var DataSource = require('loopback-datasource-juggler').DataSource;

function noop(err, res) {}

global.getDataSource = global.getSchema = function(customConfig,callback) {
	if (callback == null) {
      callback = noop;
    }

    var db = new DataSource(require('loopback-connector-redis'), customConfig || {});

    // db.log = function(a) {
    //   console.log(a);
    // };

    db.on('connected', function() {
      callback(null, db);
    });

    db.on('error', callback);

    return db;
};

