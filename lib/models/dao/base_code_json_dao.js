// third party
var util = require('util');
var _ = require('underscore');

// util
var validator = require('util/validator');

// base
var BaseJsonDao = require('models/dao/base_json_dao');

var BaseCodeJsonDao = function() {
    this.name = '';
    this.jsonData = {};
}
util.inherits(BaseCodeJsonDao, BaseJsonDao);

/**
 *
 * codeで取得
 *
 **/
BaseCodeJsonDao.prototype.getByCode = function(code, callback) {
    try {
        validator.string(code);

        validator.function(callback);
    } catch (error) {
        callback(error);
        return;
    }
    var data = _.find(this.jsonData, function(value, key) {
        return value.code === code;
    });
    callback(null, data || null);
}

module.exports = BaseCodeJsonDao;
