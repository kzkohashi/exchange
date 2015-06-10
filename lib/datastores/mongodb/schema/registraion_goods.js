// third party
var autoIncrement = require('mongoose-auto-increment');

// core
var connectionManeger = require('datastores/connection_maneger');
var connection = connectionManeger.getConnection('mongodb');
var Schema = connectionManeger.getSchema();

autoIncrement.initialize(connection);

var registraionGoodsSchema = new Schema({
    id: {type: Number},
    imagePath: {type: String, default: null},
    insertDatetime: {type: Date, default: Date.now},
    updateDatetime: {type: Date, default: Date.now},
    deleteFlag: {type: Boolean, default: false}
});

registraionGoodsSchema.plugin(autoIncrement.plugin, {
    model: 'RegistraionGoods',
    field: 'id',
    startAt: 1,
    incrementBy: 1
});

module.exports = connection.model('RegistraionGoods', registraionGoodsSchema);
