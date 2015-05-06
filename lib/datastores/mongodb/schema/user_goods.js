var connectionSetting = require('connectionSetting');
var connection = connectionSetting.connection;
var Schema = connectionSetting.schema;
var autoIncrement = require('mongoose-auto-increment');
autoIncrement.initialize(connection);

var userGoodsSchema = new Schema({
    id: {type: Number},
    userId: {type: Number},
    imagePath: {type: String, default: null},
    title : {type: String, default: null},
    price: {type: Number, default: 0},
    comment: {type: String, default: null},
    rating: {type: Number, default: 0},
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
