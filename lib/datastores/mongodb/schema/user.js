// third party
var autoIncrement = require('mongoose-auto-increment');

// core
var connectionManeger = require('datastores/connection_maneger');
var connection = connectionManeger.getConnection('mongodb');
var Schema = connectionManeger.getSchema();

autoIncrement.initialize(connection);

var userSchema = new Schema({
    id: {type: Number},
    loginId: {type: String},
    passward: {type: String},
    facebookId: {type: String},
    twitterId: {type: String},
    username: {type: String},
    email: {type: String, default: null},
    gender: {type: String},
    imagePath: {type: String, default: null},
    registDatetime: {type: Date, default: Date.now},
    insertDatetime: {type: Date, default: Date.now},
    updateDatetime: {type: Date, default: Date.now},
    deleteFlag: {type: Boolean, default: false}
});

userSchema.plugin(autoIncrement.plugin, {
    model: 'User',
    field: 'id',
    startAt: 1,
    incrementBy: 1
});

module.exports = connection.model('User', userSchema);
