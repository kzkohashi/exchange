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
 * registraion user dao
 *
 * @class user dao
 */
var PreregistrationUserDao = function() {
    this.name = 'preregistraion_user';
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
PreregistrationUserDao.prototype.add = function(email, callback) {
    var schema = this.schema;
    var preregistrationUser = new schema({
        email: email
    });
    preregistrationUser.save(callback);
}

var dao = new PreregistrationUserDao();
dao.init();
module.exports = dao;
