
// third party
var async = require('async');
var _ = require('underscore');

// util
var validator = require('util/validator');

// mater dao
var sequenceTypeDao = require('models/dao/sequence_type_dao');
var exchangeStatusDao = require('models/dao/exchange_status_dao');

// mongo dao
var sequenceDao = require('models/dao/sequence_dao');
var userExchangeGoodsDao = require('models/dao/user_exchange_goods_dao');

// service
var sequenceService = require('models/service/sequence_service');

/**
 * UserExchangeService
 *
 * @class UserExchangeService
 */
var UserExchangeService = function() {
    this.name = 'user_exchange';
}

/**
 * 交換申請を送信
 *
 * @param {Object} params パラメータ
 * @param {number} params.hostUserId ホストユーザID
 * @param {number} params.userId ユーザID
 * @param {number} params.userGoodsId ユーザグッズID
 * @param {number} params.exchangeUserGoodsId 交換ユーザグッズID
 * @param {function(Object result)} callback コールバック
 *     result: 追加結果
 */
UserExchangeService.prototype.request = function(params, callback) {
    try {
        validator.has(params, ['hostUserId', 'userId', 'userGoodsId', 'exchangeUserGoodsId']);
        validator.naturalInteger(params.hostUserId);
        validator.naturalInteger(params.userId);
        validator.naturalInteger(params.userGoodsId);
        validator.naturalInteger(params.exchangeUserGoodsId);

        validator.function(callback);
    } catch (error) {
        callback(error);
        return;
    }

    async.waterfall([
        // seqenceTypeを取得
        function(callback) {
            sequenceService.getSequenceIdBySequenceTypeCode(sequenceTypeDao.code.userExchangeSequence, callback);
        },
        // sequenceIdを取得
        function(sequenceId, callback) {
            userExchangeGoodsDao.add({
                hostUserId: params.hostUserId,
                userId: params.userId,
                userGoodsId: params.userGoodsId,
                exchangeUserGoodsId: params.exchangeUserGoodsId,
                userExchangeGoodsSequenceId: sequenceId
            }, callback);
        }
    ], callback);
}

/**
 * 申請をキャンセル
 *
 * @param {Object} params パラメータ
 * @param {number} params.userExchangeGoodsSequenceId ユーザグッズ交換グッズシーケンスID
 * @param {string} params.statusCode ステータスコード
 * @param {Date} params.currentDatetime 現在日時
 * @param {function(Object result)} callback コールバック
 *     result: 投稿データ
 */
UserExchangeService.prototype.updateStatusBySequenceIdAndStatusCode = function(params, callback) {
    try {
        validator.has(params, ['userExchangeGoodsSequenceId', 'statusCode', 'currentDatetime']);
        validator.naturalInteger(params.userExchangeGoodsSequenceId);
        validator.string(params.statusCode);
        validator.date(params.currentDatetime);

        validator.function(callback);
    } catch (error) {
        callback(error);
        return;
    }

    async.waterfall([
        // seqenceTypeを取得
        function(callback) {
            exchangeStatusDao.getByCode(params.statusCode, callback);
        },
        // sequenceIdを取得
        function(exhcangeStatus, callback) {
            userExchangeGoodsDao.updateStatusBySequenceIdAndStatusCode({
                userExchangeGoodsSequenceId: params.userExchangeGoodsSequenceId,
                status: exhcangeStatus.id,
                currentDatetime: params.currentDatetime
            }, callback);
        }
    ], callback);
}

var service = new UserExchangeService();
module.exports = service;
