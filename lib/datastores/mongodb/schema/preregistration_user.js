// third party
var autoIncrement = require('mongoose-auto-increment');

// core
var connectionManeger = require('datastores/connection_maneger');
var connection = connectionManeger.getConnection('mongodb');
var Schema = connectionManeger.getSchema();

autoIncrement.initialize(connection);

var preregistrationUserSchema = new Schema({
    id: {type: Number},
    email: {type: String},
    insertDatetime: {type: Date, default: Date.now},
    updateDatetime: {type: Date, default: Date.now},
    deleteFlag: {type: Boolean, default: false}
});

preregistrationUserSchema.plugin(autoIncrement.plugin, {
    model: 'PreregistrationUser',
    field: 'id',
    startAt: 1,
    incrementBy: 1
});

module.exports = connection.model('PreregistrationUser', preregistrationUserSchema);
