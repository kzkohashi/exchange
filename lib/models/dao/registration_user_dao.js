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
var RegistrationUserDao = function() {
    this.name = 'registraion_user';
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
RegistrationUserDao.prototype.add = function(email, callback) {
    var schema = this.schema;
    var registrationUser = new schema({
        email: email
    });
    registrationUser.save(callback);
}

var dao = new RegistrationUserDao();
dao.init();
module.exports = dao;
