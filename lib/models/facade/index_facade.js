/**
 * @fileOverview トップページFacade
 */

// third party
var util = require('util');
var async = require('async');

// core
var validator = require('util/validator');

// dao
var userDao = require('models/dao/user_dao');

// base
var BaseFacade = require('models/facade/base_facade');

/**
 * トップページFacade
 *
 * @class トップページFacade
 */
var IndexFacade = function() {
};
util.inherits(IndexFacade, BaseFacade);

/**
 * トップ
 *
 * @param {Object} params パラメータ
 * @param {number} params.userId ユーザID
 * @param {number} params.offset オフセット
 * @param {number} params.limit リミット
 * @param {Date} params.currentDatetime 現在日時
 * @param {function(Object result)} callback コールバック
 *     result: Facadeデータ
 */
IndexFacade.prototype.index = function(request, params, callback) {
    try {
        validator.has(params, ['userId', 'limit', 'offset', 'currentDatetime']);

        validator.naturalInteger(params.userId);
        validator.naturalInteger(params.limit);
        validator.unsignedInteger(params.offset);
        validator.date(params.currentDatetime);
        validator.function(callback);
    } catch(error) {
        callback(error, null);
        return;
    }

    var facadeData = {};

    async.waterfall([
        function(callback) {

        }
    ], function(error, result) {
        if (error) {
            callback(error);
            return;
        }
        callback(null, facadeData);
    });
};

var facade = new IndexFacade();
facade.init();
module.exports = facade;
