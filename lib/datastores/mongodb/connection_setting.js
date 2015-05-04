var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var connection = mongoose.createConnection('mongodb://localhost/exchange', function(error) {
    if (error) {
        console.error(error);
        process.exit();
    }
});

var connectionSettingMap = {
  connection: connection,
  schema: Schema
}

module.exports = connectionSettingMap;