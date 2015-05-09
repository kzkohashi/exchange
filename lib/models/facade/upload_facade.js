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

// service
var uploadService = require('models/service/upload_service');

// base
var BaseFacade = require('models/facade/base_facade');

/**
 * トップページFacade
 *
 * @class トップページFacade
 */
var UploadFacade = function() {
};
util.inherits(UploadFacade, BaseFacade);

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
UploadFacade.prototype.index = function(params, callback) {
    try {
        validator.has(params, ['userId']);
        validator.naturalInteger(params.userId);

        validator.function(callback);
    } catch (error) {
        callback(error);
        return;
    }

    var facadeData = {};

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
        }
    }, callback);
};

/**
 * トップ
 *
 * @param {Object} params パラメータ
 * @param {number} params.userId ユーザID
 * @param {Date} params.currentDatetime 現在日時
 * @param {function(Object result)} callback コールバック
 *     result: Facadeデータ
 */
UploadFacade.prototype.execute = function(params, callback) {
    try {
        validator.has(params, ['userId', 'title', 'price', 'description', 'brandId', 'bagTypeId', 'filePath', 'fileType', 'currentDatetime']);
        validator.naturalInteger(params.userId);
        validator.string(params.title);
        validator.naturalInteger(params.price);
        validator.string(params.description);
        validator.naturalInteger(params.brandId);
        validator.naturalInteger(params.bagTypeId);
        validator.string(params.filePath);
        validator.string(params.fileType);
        validator.date(params.currentDatetime);

        validator.function(callback);
    } catch (error) {
        callback(error);
        return;
    }
console.log('000000000000')
    async.parallel({
        // upload image to s3
        upload: function(callback) {
            uploadService.fileUpload({
                filePath: params.filePath,
                fileType: params.fileType,
                fileName: params.userId  + ':' + params.currentDatetime.getTime()
            }, callback);
        },
        // save goods data to mongodb
        add: function(callback) {
            userGoodsDao.add({
                userId: params.userId,
                title: params.title,
                description: params.description,
                price: params.price,
                brandId: params.brandId,
                bagTypeId: params.bagTypeId
            }, callback);
        }
    }, callback);
};

var facade = new UploadFacade();
facade.init();
module.exports = facade;
