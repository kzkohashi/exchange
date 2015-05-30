/**
 * @fileOverview base dao
 */

var connectionManeger = require('datastores/connection_maneger');

 /**
 * base dao
 *
 * @class base dao
 */
var BaseDao = function() {
    this.name = null;
    this.schema = null;
};

BaseDao.prototype.init = function() {
    // schema
    if (this.type === 'mongodb') {
        this.schema = require('datastores/mongodb/schema/' + this.name);
    } else if (this.type === 'json') {
        this.jsonData = require('master/' + this.name);
    }
}

module.exports = BaseDao;
