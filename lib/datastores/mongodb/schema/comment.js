// third party
var autoIncrement = require('mongoose-auto-increment');

// core
var connectionManeger = require('datastores/connection_maneger');
var connection = connectionManeger.getConnection('mongodb');
var Schema = connectionManeger.getSchema();

autoIncrement.initialize(connection);

var commentSchema = new Schema({
    id: {type: Number},
    userGoodsId: {type: Number},
    userId: {type: Number},
    comment: {type: String},
    insertDatetime: {type: Date, default: Date.now},
    updateDatetime: {type: Date, default: Date.now},
    deleteFlag: {type: Boolean, default: false}
});

commentSchema.plugin(autoIncrement.plugin, {
    model: 'Comment',
    field: 'id',
    startAt: 1,
    incrementBy: 1
});

module.exports = connection.model('Comment', commentSchema);
