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
var userGoodsDao = require('models/dao/user_goods_dao');

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
    try {
        validator.has(params, ['userId', 'offset', 'limit', 'userPageId']);
        validator.naturalInteger(params.userId);
        validator.unsignedInteger(params.offset);
        validator.naturalInteger(params.limit);
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

    async.waterfall([
        function(callback) {
            async.parallel({
                // get user info
                user: function(callback) {
                    userDao.getById(params.userPageId, callback);
                },
                // get brand list
                brandMap: function(callback) {
                    brandDao.getAllMap(callback);
                },
                // get bag type list
                bagTypeMap: function(callback) {
                    bagTypeDao.getAllMap(callback);
                }
            }, callback);
        },
        function(result, callback) {
            userGoodsDao.getListByUserIdAndOffsetLimit({
                userId: params.userPageId,
                offset: params.offset,
                limit: params.limit
            }, function(error, userGoodsList) {
                if (error) {
                    callback(error);
                    return;
                }
                _.each(userGoodsList, function(userGoods) {
                    userGoods.brandName = result.brandMap[userGoods.brandId].name;
                    userGoods.bagTypeName = result.bagTypeMap[userGoods.bagTypeId].name;
                });
                result.brandList = _.toArray(result.brandMap);
                result.bagTypeList = _.toArray(result.bagTypeMap);
                result.userGoodsList = userGoodsList;
                console.log(result);
                callback(null, result);
            });
        }
    ], callback);
};

var facade = new UserFacade();
facade.init();
module.exports = facade;
