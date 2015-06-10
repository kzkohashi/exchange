/**
 * @fileOverview registraion goods dao
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
var RegistrationGoodsDao = function() {
    this.name = 'registraion_goods';
    this.type = 'mongodb';
}
util.inherits(RegistrationGoodsDao, BaseDao);

/**
 * 新規userをDBに追加
 *
 * param {Object} params パラメータ
 * @param {function(Object result)} callback コールバック
 *     result: 追加結果
 **/
RegistrationGoodsDao.prototype.add = function(imagePath, callback) {
    var schema = this.schema;
    var registrationGoods = new schema({
        imagePath: imagePath
    });
    registrationGoods.save(callback);
}

var dao = new RegistrationGoodsDao();
dao.init();
module.exports = dao;
