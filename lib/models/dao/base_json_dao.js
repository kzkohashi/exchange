// third party
var util = require('util');
var _ = require('underscore');

// util
var validator = require('util/validator');

// base
var BaseDao = require('models/dao/base_dao');

var BaseJsonDao = function() {
    this.name = '';
    this.jsonData = {};
}
util.inherits(BaseJsonDao, BaseDao);

/**
 *
 * idで取得
 *
 **/
BaseJsonDao.prototype.getById = function(id, callback) {
    try {
        validator.unsignedInteger(id);

        validator.function(callback);
    } catch (error) {
        callback(error);
        return;
    }

    callback(null, this.jsonData[id] || null);
}

/**
 *
 * 全て取得
 *
 **/
BaseJsonDao.prototype.getAllMap = function(callback) {
    try {
        validator.function(callback);
    } catch (error) {
        callback(error);
        return;
    }
    callback(null, this.jsonData || null);
}

module.exports = BaseJsonDao;
