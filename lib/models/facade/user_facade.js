/**
 * @fileOverview トップページFacade
 */

// third party
var util = require('util');
var async = require('async');
var _ = require('underscore');
var config = require('config');

// core
var validator = require('util/validator');

// master dao
var brandDao = require('models/dao/brand_dao');
var bagTypeDao = require('models/dao/bag_type_dao');

// dao
var userDao = require('models/dao/user_dao');
var userGoodsDao = require('models/dao/user_goods_dao');

// service
var uploadService = require('models/service/upload_service');

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
            async.waterfall([
                // ユーザグッズを取得
                function(callback) {
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
                            userGoods.user = result.user;
                            userGoods.isMine = true;
                            userGoods.brandName = result.brandMap[userGoods.brandId].name;
                            userGoods.bagTypeName = result.bagTypeMap[userGoods.bagTypeId].name;
                        });
                        result.brandList = _.toArray(result.brandMap);
                        result.bagTypeList = _.toArray(result.bagTypeMap);
                        result.userGoodsList = userGoodsList;
                        result.isMypage = isMypage;
                        callback(null, result);
                    });
                }
            ], callback);
        }
    ], callback);
};

/**
 * ユーザー編集ページ
 *
 * @param {Object} params パラメータ
 * @param {number} params.userId ユーザID
 * @param {Date} params.currentDatetime 現在日時
 * @param {function(Object result)} callback コールバック
 *     result: Facadeデータ
 */
UserFacade.prototype.edit = function(params, callback) {
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
        },
    }, callback);
};

/**
 * ユーザー編集ページ
 *
 * @param {Object} params パラメータ
 * @param {number} params.userId ユーザID
 * @param {string} params.filePath ファイルパス
 * @param {string} params.fileType ファイルタイプ
 * @param {Date} params.currentDatetime 現在日時
 * @param {function(Object result)} callback コールバック
 *     result: 登録結果
 */
UserFacade.prototype.edit_image_path = function(params, callback) {
    try {
        validator.has(params, ['userId', 'filePath', 'fileType', 'currentDatetime']);
        validator.naturalInteger(params.userId);
        validator.string(params.filePath);
        validator.string(params.fileType);
        validator.date(params.currentDatetime);

        validator.function(callback);
    } catch (error) {
        callback(error);
        return;
    }

    var fileName = 'profileImage-' + params.userId;

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
            userDao.updateById({
                id: params.userId,
                updateParameter: {
                    imagePath: config.get('app.imageUrl') + fileName,
                    updateDatetime: params.currentDatetime
                }
            }, callback);
        }
    }, callback);
};

var facade = new UserFacade();
facade.init();
module.exports = facade;
