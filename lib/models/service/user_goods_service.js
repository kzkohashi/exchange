
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

UserGoodsService.prototype.fileUpload = function(params, callback) {
    try {
        validator.has(params, ['limit', 'currentDatetime']);
        validator.string(params.limit);
        validator.string(params.currentDatetime);

        validator.function(callback);
    } catch (error) {
        callback(error);
        return;
    }

    async.waterfall([
        function(callback) {
            async.parallel({
                brandMap: function(callback) {
                    brandDao.getAllMap(callback);
                },
                bagTypeMap: function(callback) {
                    bagTypeDao.getAllMap(callback);
                }
            }, callback);
        },
        function(result, callback) {

        }
    ], callback);
}

var service = new UserGoodsService();
module.exports = service;
