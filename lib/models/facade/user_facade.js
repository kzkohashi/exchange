/**
 * @fileOverview トップページFacade
 */

// third party
var util = require('util');
var async = require('async');
var _ = require('underscore');

// core
var validator = require('util/validator');

// master dao
var brandDao = require('models/dao/brand_dao');
var bagTypeDao = require('models/dao/bag_type_dao');

// dao
var userDao = require('models/dao/user_dao');

// base
var BaseFacade = require('models/facade/base_facade');

/**
 * トップページFacade
 *
 * @class トップページFacade
 */
var UserFacade = function() {
};
util.inherits(UserFacade, BaseFacade);

/**
 * トップ
 *
 * @param {Object} params パラメータ
 * @param {number} params.userId ユーザID
 * @param {number} params.userPageId ユーザページID
 * @param {Date} params.currentDatetime 現在日時
 * @param {function(Object result)} callback コールバック
 *     result: Facadeデータ
 */
UserFacade.prototype.index = function(params, callback) {
console.log(params);
    try {
        validator.has(params, ['userId', 'userPageId']);
        validator.naturalInteger(params.userId);
        validator.naturalInteger(params.userPageId);

        validator.function(callback);
    } catch (error) {
        callback(error);
        return;
    }

    var isMypage = false;
    if (params.userId === params.userPageId) {
        isMypage = true;
    }

    async.parallel({
        // get user info
        user: function(callback) {
            userDao.getById(params.userId, callback);
        },
        // get brand list
        brandList: function(callback) {
            brandDao.getAllMap(function(error, brandMap) {
                if (error) {
                    callback(error);
                    return;
                }
                callback(null, _.toArray(brandMap));
            });
        },
        // get bag type list
        bagTypeList: function(callback) {
            bagTypeDao.getAllMap(function(error, bagTypeMap) {
                if (error) {
                    callback(error);
                    return;
                }
                callback(null, _.toArray(bagTypeMap));
            });
        }
    }, callback);
};

var facade = new UserFacade();
facade.init();
module.exports = facade;
