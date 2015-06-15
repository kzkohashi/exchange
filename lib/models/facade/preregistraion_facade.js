/**
 * @fileOverview 事前登録Facade
 */

// third party
var util = require('util');
var async = require('async');
var _ = require('underscore');
var config = require('config');

// core
var validator = require('util/validator');

// mongo dao
var preregistrationGoodsDao = require('models/dao/preregistration_goods_dao');

// service
var uploadService = require('models/service/upload_service');

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

    preregistrationGoodsDao.getListByOffsetLimit({
        offset: params.offset,
        limit: params.limit
    }, function(error, result) {
        if (error) {
            callback(error);
            return;
        }
        callback(null, {
            preregistrationGoodsList: result
        });
    });
};

/**
 * トップ
 *
 * @param {Object} params パラメータ
 * @param {number} params.filePath ファイルパス
 * @param {number} params.fileType ファイルタイプ
 * @param {Date} params.currentDatetime 現在日時
 * @param {function(Object result)} callback コールバック
 *     result: 投稿結果
 */
PreregistraionFacade.prototype.upload = function(params, callback) {
    try {
        validator.has(params, ['filePath', 'fileType', 'currentDatetime']);
        validator.string(params.filePath);
        validator.string(params.fileType);
        validator.date(params.currentDatetime);

        validator.function(callback);
    } catch (error) {
        callback(error);
        return;
    }

    var fileName = 'preregistration-' + params.currentDatetime.getTime();

    async.parallel({
        // upload image to s3
        upload: function(callback) {
            uploadService.fileUpload({
                filePath: params.filePath,
                fileType: params.fileType,
                fileName: fileName
            }, callback);
        },
        // save goods data to mongodb
        add: function(callback) {
            preregistrationGoodsDao.add({
                imagePath: config.get('app.imageUrl') + fileName
            }, callback);
        }
    }, callback);
};

var facade = new PreregistraionFacade();
facade.init();
module.exports = facade;
