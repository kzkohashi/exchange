/**
 * @fileOverview connection manetger
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/**
 * connection manetger
 *
 * @class connection manetger
 */
var ConnectionManeger = function() {
    this.name = 'ConnectionManeger';
    this.connectionMap = {};
};

ConnectionManeger.prototype.getConnection = function(type) {
    if (!this.connectionMap[type]) {
        this.connectionMap[type] = mongoose.createConnection('mongodb://localhost/exchange');
    }
    return this.connectionMap[type];
}

ConnectionManeger.prototype.getSchema = function() {
    return mongoose.Schema;
}

var connectionManeger = new ConnectionManeger();
module.exports = connectionManeger;
