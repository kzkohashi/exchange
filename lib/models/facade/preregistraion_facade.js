/**
 * @fileOverview 事前登録Facade
 */

// third party
var util = require('util');
var async = require('async');
var _ = require('underscore');

// core
var validator = require('util/validator');

// mongo dao
var userDao = require('models/dao/user_dao');

// service
var userGoodsService = require('models/service/user_goods_service');

// base
var BaseFacade = require('models/facade/base_facade');

/**
 * 事前登録Facade
 *
 * @class 事前登録Facade
 */
var PreregistraionFacade = function() {
};
util.inherits(PreregistraionFacade, BaseFacade);

/**
 * トップ
 *
 * @param {Object} params パラメータ
 * @param {number} params.offset オフセット
 * @param {number} params.limit リミット
 * @param {Date} params.currentDatetime 現在日時
 * @param {function(Object result)} callback コールバック
 *     result: 投稿データ
 */
PreregistraionFacade.prototype.index = function(params, callback) {
    try {
        validator.has(params, ['offset', 'limit', 'currentDatetime']);
        validator.unsignedInteger(params.offset);
        validator.naturalInteger(params.limit);
        validator.date(params.currentDatetime);

        validator.function(callback);
    } catch (error) {
        callback(error);
        return;
    }


};

var facade = new PreregistraionFacade();
facade.init();
module.exports = facade;
