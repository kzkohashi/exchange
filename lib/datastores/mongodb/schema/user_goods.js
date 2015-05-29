// third party
var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');
var Schema = mongoose.Schema;

// core
var connectionManeger = require('datastores/connection_maneger');
var connection = connectionManeger.getConnection('mongodb');

autoIncrement.initialize(connection);

var userGoodsSchema = new Schema({
    id: {type: Number},
    userId: {type: Number},
    imagePath: {type: String, default: null},
    title : {type: String, default: null},
    price: {type: Number, default: 0},
    description: {type: String, default: null},
    brandId: {type: Number},
    bagTypeId: {type: Number},
    insertDatetime: {type: Date, default: Date.now},
    updateDatetime: {type: Date, default: Date.now},
    deleteFlag: {type: Boolean, default: false}
});

userGoodsSchema.plugin(autoIncrement.plugin, {
    model: 'UserGoods',
    field: 'id',
    startAt: 1,
    incrementBy: 1
});

module.exports = connection.model('UserGoods', userGoodsSchema);
