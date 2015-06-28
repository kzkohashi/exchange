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
    this.name = 'preregistration_goods';
    this.type = 'mongodb';
}
util.inherits(PreregistrationGoodsDao, BaseDao);

/**
 * 新規userをDBに追加
 *
 * param {Object} params パラメータ
 * param {string} params.imagePath イメージパス
 * @param {function(Object result)} callback コールバック
 *     result: 追加結果
 **/
PreregistrationGoodsDao.prototype.add = function(params, callback) {
    try {
        validator.has(params, ['imagePath']);
        validator.string(params.imagePath);

        validator.function(callback);
    } catch (error) {
        callback(error);
        return;
    }

    var schema = this.schema;
    var registrationGoods = new schema({
        imagePath: params.imagePath
    });
    registrationGoods.save(callback);
}

/**
 * コメントを追加
 *
 * param {Object} params パラメータ
 * param {number} params.id ID
 * param {string} params.comment コメント
 * @param {function(Object result)} callback コールバック
 *     result: 追加結果
 **/
PreregistrationGoodsDao.prototype.addComment = function(params, callback) {
    try {
        validator.has(params, ['id', 'comment']);
        validator.naturalInteger(params.id);
        validator.string(params.comment);

        validator.function(callback);
    } catch (error) {
        callback(error);
        return;
    }

    var schema = this.schema;

    schema.findOne({
        id: params.id
    }, function(error, result) {
        if (error) {
            callback(error);
            return;
        }
        result.commentList.push(params.comment);
        result.save(callback);
    });
}

/**
 * 投稿を取得
 *
 * param {Object} params パラメータ
 * param {number} params.offset オフセット
 * param {number} params.limit リミット
 * @param {function(Object result)} callback コールバック
 *     result: 追加結果
 **/
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
