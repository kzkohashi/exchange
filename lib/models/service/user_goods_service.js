
// third party
var async = require('async');
var _ = require('underscore');

// master dao
var brandDao = require('models/dao/brand_dao');
var bagTypeDao = require('models/dao/bag_type_dao');

// mongo dao
var userGoodsDao = require('models/dao/user_goods_dao');

// util
var validator = require('util/validator');

var UserGoodsService = function() {
    this.name = 'UserGoods';
}

UserGoodsService.prototype.getListByOffsetLimit = function(params, callback) {
    try {
        validator.has(params, ['offset', 'limit']);
        validator.unsignedInteger(params.offset);
        validator.naturalInteger(params.limit);

        validator.function(callback);
    } catch (error) {
        callback(error);
        return;
    }

    async.waterfall([
        // マスター情報を取得
        function(callback) {
            async.parallel({
                // ブランド情報を取得
                brandMap: function(callback) {
                    brandDao.getAllMap(callback);
                },
                // バッグタイプを取得
                bagTypeMap: function(callback) {
                    bagTypeDao.getAllMap(callback);
                }
            }, callback);
        },
        // 投稿情報を取得
        function(result, callback) {
            userGoodsDao.getListByOffsetLimit({
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
                callback(null, userGoodsList);
            });
        }
    ], callback);
}

UserGoodsService.prototype.getListByBrandIdAndOffsetLimit = function(params, callback) {
    try {
        validator.has(params, ['brandId', 'offset', 'limit']);
        validator.naturalInteger(params.brandId);
        validator.unsignedInteger(params.offset);
        validator.naturalInteger(params.limit);

        validator.function(callback);
    } catch (error) {
        callback(error);
        return;
    }

    async.waterfall([
        // マスター情報を取得
        function(callback) {
            async.parallel({
                // ブランド情報を取得
                brandMap: function(callback) {
                    brandDao.getAllMap(callback);
                },
                // バッグタイプを取得
                bagTypeMap: function(callback) {
                    bagTypeDao.getAllMap(callback);
                }
            }, callback);
        },
        // 投稿情報を取得
        function(result, callback) {
            userGoodsDao.getListByBrandIdAndOffsetLimit({
                brandId: params.brandId,
                offset: params.offset,
                limit: params.limit
            }, function(error, userGoodsList) {
                if (error) {
                    console.log(error)
                    callback(error);
                    return;
                }
                _.each(userGoodsList, function(userGoods) {
                    userGoods.brandName = result.brandMap[userGoods.brandId].name;
                    userGoods.bagTypeName = result.bagTypeMap[userGoods.bagTypeId].name;
                });
                callback(null, userGoodsList);
            });
        }
    ], callback);
}

UserGoodsService.prototype.getListByBagTypeIdAndOffsetLimit = function(params, callback) {
    try {
        validator.has(params, ['bagTypeId', 'offset', 'limit']);
        validator.naturalInteger(params.bagTypeId);
        validator.unsignedInteger(params.offset);
        validator.naturalInteger(params.limit);

        validator.function(callback);
    } catch (error) {
        callback(error);
        return;
    }

    async.waterfall([
        // マスター情報を取得
        function(callback) {
            async.parallel({
                // ブランド情報を取得
                brandMap: function(callback) {
                    brandDao.getAllMap(callback);
                },
                // バッグタイプを取得
                bagTypeMap: function(callback) {
                    bagTypeDao.getAllMap(callback);
                }
            }, callback);
        },
        // 投稿情報を取得
        function(result, callback) {
            userGoodsDao.getListByBagTypeIdAndOffsetLimit({
                bagTypeId: params.bagTypeId,
                offset: params.offset,
                limit: params.limit
            }, function(error, userGoodsList) {
                if (error) {
                    console.log(error)
                    callback(error);
                    return;
                }
                _.each(userGoodsList, function(userGoods) {
                    userGoods.brandName = result.brandMap[userGoods.brandId].name;
                    userGoods.bagTypeName = result.bagTypeMap[userGoods.bagTypeId].name;
                });
                callback(null, userGoodsList);
            });
        }
    ], callback);
}

var service = new UserGoodsService();
module.exports = service;
