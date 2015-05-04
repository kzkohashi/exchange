/**
 *  base dao
 */
var BaseDao = function() {
    this.name = null;
    this.schema = null;
};

BaseDao.prototype.init = function() {
    // schema
    this.schema = require('datastores/mongodb/schema/' + this.name);
}

module.exports = BaseDao;