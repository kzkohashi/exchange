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
 */var UserDao = function() {
    this.name = 'user';
}
util.inherits(UserDao, BaseDao);

/**
 * 新規userをDBに追加
 * param {Object} params
 * result
 *
 **/
UserDao.prototype.add = function(params, callback) {
    var schema = this.schema;
    var user = new schema({
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
 * param {int} id
 **/
UserDao.prototype.updateByid = function(id, userInfo, callback) {
    try {
        validator.unsignedInteger(id);
        validator.object(userInfo);

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
            $set: userInfo
        }, callback);
}

/**
 * 最終ログイン日時の更新
 * param {object} params
 * param {number} params.id
 * param {date} params.lastLoginDatetime
 **/
UserDao.prototype.updateUpdateDatetimeByid = function(params, callback) {
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
