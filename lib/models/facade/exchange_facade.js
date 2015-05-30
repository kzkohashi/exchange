/**
 * @fileOverview ExchangeFacade
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
var exchangeStatusDao = require('models/dao/exchange_status_dao');

// mongo dao
var userDao = require('models/dao/user_dao');
var userExchangeGoodsDao = require('models/dao/user_exchange_goods_dao');

// service
var userGoodsService = require('models/service/user_goods_service');

// base
var BaseFacade = require('models/facade/base_facade');

/**
 * ExchangeFacade
 *
 * @class ExchangeFacade
 */
var ExchangeFacade = function() {
};
util.inherits(ExchangeFacade, BaseFacade);

/**
 * 交換リストを取得
 *
 * @param {Object} params パラメータ
 * @param {number} params.userId ユーザID
 * @param {Date} params.currentDatetime 現在日時
 * @param {function(Object result)} callback コールバック
 *     result: 投稿データ
 */
ExchangeFacade.prototype.list = function(params, callback) {
    try {
        validator.has(params, ['userId', 'currentDatetime']);
        validator.naturalInteger(params.userId);
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
        userExchangeGoodsList: function(callback) {
            async.waterfall([
                // 交換グッズリストを取得
                function(callback) {
                    userExchangeGoodsDao.getListByUserId(params.userId, callback);
                },
                function(userExchangeGoodsList, callback) {
                    exchangeStatusDao.getAllMap(function(error, exchangeStatusMap) {
                        if (error) {
                            callback(error);
                            return;
                        }
                        _.each(userExchangeGoodsList, function(userExchangeGoods) {
                            userExchangeGoods.exchangeStatus = exchangeStatusMap[userExchangeGoods.status];
                        });
                        callback(null, userExchangeGoodsList);
                    })
                },
                // グッズ情報を取得
                function(userExchangeGoodsList, callback) {
                    var userGoodsIdList = [];
                    _.each(userExchangeGoodsList, function(userExchangeGoods) {
                        userGoodsIdList.push(userExchangeGoods.userGoodsId);
                        userGoodsIdList.push(userExchangeGoods.exchangeUserGoodsId);
                    });
                    userGoodsService.getMapByUserGoodsIdList(_.uniq(userGoodsIdList), function(error, userGoodsMap) {
                        if (error) {
                            callback(error);
                        }
                        _.each(userExchangeGoodsList, function(userExchangeGoods) {
                            userExchangeGoods.userGoods = userGoodsMap[userExchangeGoods.userGoodsId];
                            userExchangeGoods.exchangeUserGoods = userGoodsMap[userExchangeGoods.exchangeUserGoodsId];
                        });
                        callback(null, userExchangeGoodsList);
                    });
                }
            ], callback);
        }
    }, callback);
};

/**
 * 交換申請を送信
 *
 * @param {Object} params パラメータ
 * @param {number} params.userId ユーザID
 * @param {number} params.userGoodsId ユーザグッズID
 * @param {string} params.comment コメント
 * @param {Date} params.currentDatetime 現在日時
 * @param {function(Object result)} callback コールバック
 *     result: 投稿データ
 */
ExchangeFacade.prototype.request = function(params, callback) {
    try {
        validator.has(params, ['userId', 'userGoodsId', 'exchangeUserGoodsId', 'currentDatetime']);
        validator.naturalInteger(params.userId);
        validator.naturalInteger(params.userGoodsId);
        validator.naturalInteger(params.exchangeUserGoodsId);
        validator.date(params.currentDatetime);

        validator.function(callback);
    } catch (error) {
        callback(error);
        return;
    }

    // コメントを登録
    commentDao.add({
        userId: params.userId,
        userGoodsId: params.userGoodsId,
        comment: params.comment
    }, callback);
};

var facade = new ExchangeFacade();
facade.init();
module.exports = facade;
