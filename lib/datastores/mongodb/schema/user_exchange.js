// third party
var autoIncrement = require('mongoose-auto-increment');

// core
var connectionManeger = require('datastores/connection_maneger');
var connection = connectionManeger.getConnection('mongodb');
var Schema = connectionManeger.getSchema();

autoIncrement.initialize(connection);

var userExchangeSchema = new Schema({
    id: {type: Number},
    userExchangeSequenceId: {type: Number},
    userGoodsId: {type: Number},
    exchangeUserGoodsId: {type: Number},
    status: {type: String, default: 1},
    insertDatetime: {type: Date, default: Date.now},
    updateDatetime: {type: Date, default: Date.now},
    deleteFlag: {type: Boolean, default: false}
});

userExchangeSchema.plugin(autoIncrement.plugin, {
    model: 'userExchangeSchema',
    field: 'id',
    startAt: 1,
    incrementBy: 1
});

module.exports = connection.model('User', userExchangeSchema);
