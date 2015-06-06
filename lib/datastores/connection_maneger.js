/**
 * @fileOverview connection manetger
 */

// third party
var mongoose = require('mongoose');

/**
 * connection manetger
 *
 * @class connection manetger
 */
var ConnectionManeger = function() {
    this.name = 'ConnectionManeger';
    this.connectionPool = {};
};

ConnectionManeger.prototype.getConnection = function(type) {
    if (!this.connectionPool[type]) {
        this.connectionPool[type] = mongoose.createConnection('mongodb://localhost/exchange');
    }
    return this.connectionPool[type];
}

ConnectionManeger.prototype.getSchema = function() {
    return mongoose.Schema;
}

var connectionManeger = new ConnectionManeger();
module.exports = connectionManeger;
