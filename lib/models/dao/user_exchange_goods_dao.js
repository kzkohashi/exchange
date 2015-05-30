/**
 * @fileOverview user dao
 */

// third party
var util = require('util');
var _ = require('underscore');

// util
var validator = require('util/validator');

// base
var BaseDao = require('models/dao/base_dao');

/**
 * user dao
 *
 * @class user dao
 */
var UserExchangeGoodsDao = function() {
    this.name = 'user_exchange_goods';
    this.type = 'mongodb';
}
util.inherits(UserExchangeGoodsDao, BaseDao);

/**
 * 新規userをDBに追加
 * param {Object} params
 * result
 *
 **/
UserExchangeGoodsDao.prototype.add = function(params, callback) {
    var schema = this.schema;
    var user = new schema({
        userExchangeGoodsSequenceId: params.userExchangeGoodsSequenceId,
        userGoodsId: params.userGoodsId,
        exchangeUserGoodsId: params.exchangeUserGoodsId
    });
    user.save(callback);
}

/**
 * idからuserを取得
 * param {int} id
 * result {Object} user
 *
 **/
UserExchangeGoodsDao.prototype.getById = function(id, callback) {
    try {
        validator.unsignedInteger(id);

        validator.function(callback);
    } catch (error) {
        callback(error);
        return;
    }

    var self = this;
    self.schema
        .findOne({
            id: id
        }, callback);
}

UserExchangeGoodsDao.prototype.getMapByIdList = function(idList, callback) {
    try {
        validator.array(idList);
        _.each(idList, function(id) {
            validator.unsignedInteger(id);
        });

        validator.function(callback);
    } catch (error) {
        callback(error);
        return;
    }

    var self = this;
    self.schema
        .find({
            id: { $in: idList }
        }, function(error, result) {
            callback(error, _.indexBy(result, 'id'));
        });
}

/**
 * userIdで取得
 * param {int} userId
 * result {Object} user
 *
 **/
UserExchangeGoodsDao.prototype.getListByUserId = function(userId, callback) {
    try {
        validator.naturalInteger(userId);

        validator.function(callback);
    } catch (error) {
        callback(error);
        return;
    }

    var self = this;

    self.schema
        .find({
            userId: userId
        }, callback);
}

/**
 * userの更新
 * param {int} id
 **/
UserExchangeGoodsDao.prototype.updateById = function(params, callback) {
    try {
        validator.has(params, ['id', 'updateParameter']);
        validator.unsignedInteger(id);
        validator.object(updateParameter);

        validator.function(callback);
    } catch (error) {
        callback(error);
        return;
    }

    var self = this;
    self.schema.update(
        //where句
        {
            id: id
        },
        //set句
        {
            $set: updateParameter
        }, callback);
}

/**
 * deleteFlagによる削除
 * param {int} id
 **/
UserExchangeGoodsDao.prototype.deleteById = function(id, callback) {
    try {
        validator.unsignedInteger(id);

        validator.function(callback);
    } catch (error) {
        callback(error);
        return;
    }

    var self = this;
    self.schema.update(
        //where句
        {id: id},
        //set句
        {
            $set: {
                deleteFlag: true,
                updateDatetime: new Date()
            }
        }, callback);
}

var dao = new UserExchangeGoodsDao();
dao.init();
module.exports = dao;
