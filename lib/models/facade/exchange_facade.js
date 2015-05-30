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

// mongo dao
var userDao = require('models/dao/user_dao');

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
 * @param {number} params.userGoodsId ユーザグッズID
 * @param {Date} params.currentDatetime 現在日時
 * @param {function(Object result)} callback コールバック
 *     result: 投稿データ
 */
ExchangeFacade.prototype.list = function(params, callback) {
    try {
        validator.has(params, ['userId', 'userGoodsId', 'offset', 'limit', 'currentDatetime']);
        validator.naturalInteger(params.userId);
        validator.naturalInteger(params.userGoodsId);
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
        userGoods: function(callback) {
            userGoodsService.getByUserGoodsId({
                userGoodsId: params.userGoodsId
            }, callback);
        },
        commentList: function(callback) {
            commentService.getListByUserGoodsIdAndOffsetLimit({
                userGoodsId: params.userGoodsId,
                offset: params.offset,
                limit: params.limit
            }, callback);
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
        validator.has(params, ['userId', 'userGoodsId', 'comment', 'currentDatetime']);
        validator.naturalInteger(params.userId);
        validator.unsignedInteger(params.userGoodsId);
        validator.string(params.comment);
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

var facade = new IndexFacade();
facade.init();
module.exports = facade;
