var connectionSetting = require('datastores/mongodb/connection_setting');
var connection = connectionSetting.connection;
var Schema = connectionSetting.schema;
var autoIncrement = require('mongoose-auto-increment');
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
