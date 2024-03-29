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
var UserDao = function() {
    this.name = 'user';
    this.type = 'mongodb';
}
util.inherits(UserDao, BaseDao);

/**
 * 新規userをDBに追加
 *
 * param {Object} params パラメータ
 * @param {function(Object result)} callback コールバック
 *     result: 追加結果
 **/
UserDao.prototype.add = function(params, callback) {
    var schema = this.schema;
    var user = new schema({
        loginId: params.loginId,
        passward: params.passward,
        facebookId: params.facebookId,
        twitterId: params.twitterId,
        username: params.username,
        gender: params.gender,
        email: params.email,
        imagePath: params.imagePath
    });
    user.save(callback);
}

/**
 * idからuserを取得
 * param {int} id
 * result {Object} user
 *
 **/
UserDao.prototype.getById = function(id, callback) {
    try {
        validator.unsignedInteger(id);

        validator.function(callback);
    } catch (error) {
        callback(error);
        return;
    }

    var self = this;
    self.schema.findOne({
        id: id
    }, callback);
}

/**
 * ログインIDからuserを取得
 * param {number} loginId
 * result {Object} user
 *
 **/
UserDao.prototype.getByLoginId = function(loginId, callback) {
    try {
        validator.string(loginId);

        validator.function(callback);
    } catch (error) {
        callback(error);
        return;
    }

    var self = this;
    self.schema.findOne({
        loginId: loginId
    }, callback);
}

/**
 * facebookIdからuserを取得
 *
 * param {int} id
 * result {Object} user
 *
 **/
UserDao.prototype.getByFacebookId = function(facebookId, callback) {
    try {
        validator.string(facebookId);

        validator.function(callback);
    } catch (error) {
        callback(error);
        return;
    }

    var self = this;
    self.schema.findOne({
        facebookId: facebookId
    }, callback);
}

/**
 * twitterIdからuserを取得
 *
 * param {int} id
 * result {Object} user
 *
 **/
UserDao.prototype.getByTwitterId = function(twitterId, callback) {
    try {
        validator.string(twitterId);

        validator.function(callback);
    } catch (error) {
        callback(error);
        return;
    }

    var self = this;
    self.schema.findOne({
        twitterId: twitterId
    }, callback);
}

UserDao.prototype.getMapByIdList = function(idList, callback) {
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
    self.schema.find({id: { $in: idList }}, function(error, result){
        callback(error, _.indexBy(result, 'id'));
    });
}

/**
 *
 * idListからuserListを取得
 * param {array} idList
 * result {Object} user
 *
 **/
UserDao.prototype.getListByidList = function(idList, callback) {
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
    self.schema.find({
        id: { $in: idList }
    }, callback);
}

/**
 * userを新着順に取得
 **/
UserDao.prototype.getRecentLoginUserList = function(params, callback) {
    try {
        validator.has(params, ['updateDatetime', 'limit']);
        validator.date(params.updateDatetime);
        validator.unsignedInteger(params.limit);

        validator.function(callback);
    } catch (error) {
        callback(error);
        return;
    }

    var self = this;
    self.schema
        .find({
            updateDatetime: {$lt: params.updateDatetime},
            deleteFlag: false
        })
        .sort({ updateDatetime: -1 })
        .limit(params.limit)
        .exec(callback);
}

/**
 * userの更新
 *
 * param {Object} params パラメータ
 * param {number} params.id ユーザID
 * @param {function(Object result)} callback コールバック
 *     result: 追加結果
 **/
UserDao.prototype.updateById = function(params, callback) {
    try {
        validator.has(params, ['id', 'updateParameter']);
        validator.unsignedInteger(id);
        validator.object(updateParameter);
        if (params.updateParameter.hasOwnProperty('imagePath')) {
            validator.string(params.updateParameter.imagePath);
        }
        validator.date(params.updateParameter.currentDatetime);

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
 * 最終ログイン日時の更新
 * param {object} params
 * param {number} params.id
 * param {date} params.lastLoginDatetime
 **/
UserDao.prototype.updateUpdateDatetimeById = function(params, callback) {
    try {
        validator.has(params, ['id', 'updateDatetime']);
        validator.unsignedInteger(params.id);
        validator.date(params.updateDatetime);

        validator.function(callback);
    } catch (error) {
        callback(error);
        return;
    }

    var self = this;
    self.schema.update(
        //where句
        {
            id: params.id
        },
        //set句
        {
            $set: {updateDatetime: params.updateDatetime}
        }, callback);
}

/**
 * deleteFlagによる削除
 * param {int} id
 **/
UserDao.prototype.deleteById = function(id, callback) {
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

var dao = new UserDao();
dao.init();
module.exports = dao;
