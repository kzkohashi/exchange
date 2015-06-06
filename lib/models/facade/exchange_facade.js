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
var sequenceTypeDao = require('models/dao/sequence_type_dao');

// service
var userGoodsService = require('models/service/user_goods_service');
var userExchangeService = require('models/service/user_exchange_service');

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
        userExchangeGoodsMap: function(callback) {
            async.waterfall([
                function(callback) {
                    async.parallel({
                        // 交換グッズリストを取得
                        userExchangeGoodsList: function(callback) {
                            userExchangeGoodsDao.getListByUserId(params.userId, callback);
                        },
                        // 交換ステータスをステータスを取得
                        exchangeStatusMap: function(callback) {
                            exchangeStatusDao.getAllMap(callback);
                        }
                    }, callback);
                },
                 // グッズ情報を取得
                function(result, callback) {
                    var userExchangeGoodsList = [];
                    // ステータスを取得
                    _.each(result.userExchangeGoodsList, function(userExchangeGoods, index) {
                        userExchangeGoodsList[index] = {};
                        userExchangeGoodsList[index].userExchangeGoods = userExchangeGoods;
                        userExchangeGoodsList[index].exchangeStatus = result.exchangeStatusMap[userExchangeGoods.status];
                    });

                    var userGoodsIdList = [];
                    _.each(result.userExchangeGoodsList, function(userExchangeGoods) {
                        userGoodsIdList.push(userExchangeGoods.userGoodsId);
                        userGoodsIdList.push(userExchangeGoods.exchangeUserGoodsId);
                    });

                    // グッズ情報を取得
                    userGoodsService.getMapByUserGoodsIdList(_.uniq(userGoodsIdList), function(error, userGoodsMap) {
                        if (error) {
                            callback(error);
                        }
                        _.each(result.userExchangeGoodsList, function(userExchangeGoods, index) {
                            userExchangeGoodsList[index].userGoods = userGoodsMap[userExchangeGoods.userGoodsId];
                            userExchangeGoodsList[index].exchangeUserGoods = userGoodsMap[userExchangeGoods.exchangeUserGoodsId];
                        });
                        callback(null, _.groupBy(userExchangeGoodsList, function(userExchangeGoods) {
                            return userExchangeGoods.exchangeStatus.id;
                        }));
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
 * @param {number} params.hostUserId ホストユーザID
 * @param {number} params.userId ユーザID
 * @param {number} params.userGoodsId ユーザグッズID
 * @param {number} params.exchangeUserGoodsId 交換ユーザグッズID
 * @param {Date} params.currentDatetime 現在日時
 * @param {function(Object result)} callback コールバック
 *     result: 投稿データ
 */
ExchangeFacade.prototype.request = function(params, callback) {
    console.log(params);
    try {
        validator.has(params, ['hostUserId', 'userId', 'userGoodsId', 'exchangeUserGoodsId', 'currentDatetime']);
        validator.naturalInteger(params.hostUserId);
        validator.naturalInteger(params.userId);
        validator.naturalInteger(params.userGoodsId);
        validator.naturalInteger(params.exchangeUserGoodsId);
        validator.date(params.currentDatetime);

        validator.function(callback);
    } catch (error) {
        callback(error);
        return;
    }

    // 交換申請を送る
    userExchangeService.request({
        hostUserId: params.hostUserId,
        userId: params.userId,
        userGoodsId: params.userGoodsId,
        exchangeUserGoodsId: params.exchangeUserGoodsId
    }, callback);
};

/**
 * 申請をキャンセル
 *
 * @param {Object} params パラメータ
 * @param {number} params.userId ユーザID
 * @param {number} params.userExchangeGoodsSequenceId ユーザグッズ交換グッズシーケンスID
 * @param {Date} params.currentDatetime 現在日時
 * @param {function(Object result)} callback コールバック
 *     result: 投稿データ
 */
ExchangeFacade.prototype.requestCancel = function(params, callback) {
    try {
        validator.has(params, ['userId', 'userExchangeGoodsSequenceId', 'currentDatetime']);
        validator.naturalInteger(params.userId);
        validator.naturalInteger(params.userExchangeGoodsSequenceId);
        validator.date(params.currentDatetime);

        validator.function(callback);
    } catch (error) {
        callback(error);
        return;
    }

    // ステータス更新
    userExchangeService.updateStatusBySequenceIdAndStatusCode({
        userExchangeGoodsSequenceId: params.userExchangeGoodsSequenceId,
        statusCode: exchangeStatusDao.code.requestCancel,
        currentDatetime: params.currentDatetime
    }, callback);
};

/**
 * 拒否する
 *
 * @param {Object} params パラメータ
 * @param {number} params.userId ユーザID
 * @param {number} params.userExchangeGoodsSequenceId ユーザグッズ交換グッズシーケンスID
 * @param {Date} params.currentDatetime 現在日時
 * @param {function(Object result)} callback コールバック
 *     result: 投稿データ
 */
ExchangeFacade.prototype.reject = function(params, callback) {
    try {
        validator.has(params, ['userId', 'userExchangeGoodsSequenceId', 'currentDatetime']);
        validator.naturalInteger(params.userId);
        validator.naturalInteger(params.userExchangeGoodsSequenceId);
        validator.date(params.currentDatetime);

        validator.function(callback);
    } catch (error) {
        callback(error);
        return;
    }

    // ステータス更新
    userExchangeService.updateStatusBySequenceIdAndStatusCode({
        userExchangeGoodsSequenceId: params.userExchangeGoodsSequenceId,
        statusCode: exchangeStatusDao.code.reject,
        currentDatetime: params.currentDatetime
    }, callback);
};

/**
 * 承認する
 *
 * @param {Object} params パラメータ
 * @param {number} params.userId ユーザID
 * @param {number} params.userExchangeGoodsSequenceId ユーザグッズ交換グッズシーケンスID
 * @param {Date} params.currentDatetime 現在日時
 * @param {function(Object result)} callback コールバック
 *     result: 投稿データ
 */
ExchangeFacade.prototype.approve = function(params, callback) {
    try {
        validator.has(params, ['userId', 'userExchangeGoodsSequenceId', 'currentDatetime']);
        validator.naturalInteger(params.userId);
        validator.naturalInteger(params.userExchangeGoodsSequenceId);
        validator.date(params.currentDatetime);

        validator.function(callback);
    } catch (error) {
        callback(error);
        return;
    }

    // ステータス更新
    userExchangeService.updateStatusBySequenceIdAndStatusCode({
        userExchangeGoodsSequenceId: params.userExchangeGoodsSequenceId,
        statusCode: exchangeStatusDao.code.approve,
        currentDatetime: params.currentDatetime
    }, callback);
};

var facade = new ExchangeFacade();
facade.init();
module.exports = facade;
