/**
 * @fileOverview preregistraion goods dao
 */

// third party
var util = require('util');
var _ = require('underscore');

// util
var validator = require('util/validator');

// base
var BaseDao = require('models/dao/base_dao');

/**
 * registraion goods dao
 *
 * @class registraion goods dao
 */
var PreregistrationGoodsDao = function() {
    this.name = 'preregistraion_goods';
    this.type = 'mongodb';
}
util.inherits(PreregistrationGoodsDao, BaseDao);

/**
 * 新規userをDBに追加
 *
 * param {Object} params パラメータ
 * @param {function(Object result)} callback コールバック
 *     result: 追加結果
 **/
PreregistrationGoodsDao.prototype.add = function(params, callback) {
    var schema = this.schema;
    var registrationGoods = new schema({
        imagePath: params.imagePath
    });
    registrationGoods.save(callback);
}

PreregistrationGoodsDao.prototype.getListByOffsetLimit = function(params, callback) {
    try {
        validator.has(params, ['offset', 'limit']);
        validator.unsignedInteger(params.offset);
        validator.naturalInteger(params.limit);

        validator.function(callback);
    } catch (error) {
        callback(error);
        return;
    }

    var self = this;

    self.schema.find({
        deleteFlag: false
    })
    .sort({id: -1})
    .skip(params.offset * params.limit)
    .limit(params.limit)
    .exec(callback);
}

var dao = new PreregistrationGoodsDao();
dao.init();
module.exports = dao;
