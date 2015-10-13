var path = require('path');
var Register = require('file-register');

// The lib.
var lib = Register();

// Register files.
lib.register(path.resolve(__dirname, 'backends'));

// Export.
module.exports = lib;
