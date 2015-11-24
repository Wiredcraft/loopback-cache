module.exports = require('should');

var DataSource = require('loopback-datasource-juggler').DataSource;

function noop(err, res) {}

global.getDataSource = global.getSchema = function(database, customConfig, callback) {
  if (callback == null) {
    callback = noop;
  }

  var db = new DataSource(require(database), customConfig || {});

  db.on('connected', function() {
    callback(null, db);
  });

  db.on('error', callback);

  return db;
};

