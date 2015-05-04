var connectionSetting = require('datastores/mongodb/connection_setting');
var connection = connectionSetting.connection;
var Schema = connectionSetting.schema;
var autoIncrement = require('mongoose-auto-increment');
autoIncrement.initialize(connection);

var userSchema = new Schema({
    id: {type: Number},
    facebookId: {type: String},
    twitterId: {type: String},
    username: {type: String},
    email: {type: String},
    gender: {type: String},
    imagePath: {type: String, default: 'https://localhost/image/sample.jpeg'},
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
