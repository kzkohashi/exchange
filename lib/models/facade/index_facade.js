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

// mongo dao
var userDao = require('models/dao/user_dao');
var userGoodsDao = require('models/dao/user_goods_dao');

// service
var userGoodsService = require('models/service/user_goods_service');

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
 *     result: 投稿データ
 */
IndexFacade.prototype.index = function(params, callback) {
    try {
        validator.has(params, ['userId', 'offset', 'limit', 'currentDatetime']);
        validator.naturalInteger(params.userId);
        validator.unsignedInteger(params.offset);
        validator.naturalInteger(params.limit);
        validator.date(params.currentDatetime);

        validator.function(callback);
    } catch (error) {
        callback(error);
        return;
    }

    async.parallel({
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
        },
        // 投稿情報を取得
        userGoodsList: function(callback) {
            userGoodsService.getListByOffsetLimit({
                offset: params.offset,
                limit: params.limit
            }, function(error, userGoodsList) {
                if (error) {
                    callback(error);
                    return;
                }
                _.each(userGoodsList, function(userGoods) {
                    userGoods.isMine = false;
                    if (userGoods.userId === params.userId) {
                        userGoods.isMine = true;
                    }
                });
                callback(null, userGoodsList);
            });
        },
        // 自分の投稿情報を取得
        myUserGoodsList: function(callback) {
            async.waterfall([
                function(callback) {
                    async.parallel({
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
                    async.waterfall([
                        // ユーザグッズを取得
                        function(callback) {
                            userGoodsDao.getListByUserIdAndOffsetLimit({
                                userId: params.userId,
                                offset: params.offset,
                                limit: params.limit
                            }, callback);
                        },
                        // ユーザ情報を取得
                        function(userGoodsList, callback) {
                            var userIdList = _.uniq(_.pluck(userGoodsList, 'userId'));
                            userDao.getById(params.userId, function(error, user) {
                                if (error) {
                                    callback(error);
                                    return;
                                }
                                _.each(userGoodsList, function(userGoods) {
                                    userGoods.user = user;
                                });
                                callback(null, userGoodsList);
                            });
                        },
                        // データ整形
                        function(userGoodsList, callback) {
                            _.each(userGoodsList, function(userGoods) {
                                userGoods.brandName = result.brandMap[userGoods.brandId].name;
                                userGoods.bagTypeName = result.bagTypeMap[userGoods.bagTypeId].name;
                            });
                            callback(null, userGoodsList);
                        }
                    ], callback);
                }
            ], callback);
        }
    }, callback);
};

var facade = new IndexFacade();
facade.init();
module.exports = facade;
