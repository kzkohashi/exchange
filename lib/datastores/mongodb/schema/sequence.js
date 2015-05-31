// third party
var autoIncrement = require('mongoose-auto-increment');

// core
var connectionManeger = require('datastores/connection_maneger');
var connection = connectionManeger.getConnection('mongodb');
var Schema = connectionManeger.getSchema();

autoIncrement.initialize(connection);

var sequenceSchema = new Schema({
    id: {type: Number},
    sequenceId: {type: Number, default: 1},
    typeId: {type: Number},
    insertDatetime: {type: Date, default: Date.now},
    updateDatetime: {type: Date, default: Date.now},
    deleteFlag: {type: Boolean, default: false}
});

sequenceSchema.plugin(autoIncrement.plugin, {
    model: 'sequenceSchema',
    field: 'id',
    startAt: 1,
    incrementBy: 1
});

module.exports = connection.model('sequenceSchema', sequenceSchema);
