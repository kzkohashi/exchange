/**
 * @fileOverview 認証Facade
 */

// third party
var util = require('util');
var async = require('async');
var _ = require('underscore');

// core
var validator = require('util/validator');

// mongo dao
var userDao = require('models/dao/user_dao');

// service
var userService = require('models/service/user_service');

// base
var BaseFacade = require('models/facade/base_facade');

/**
 * 認証Facade
 *
 * @class 認証Facade
 */
var AuthFacade = function() {
};
util.inherits(AuthFacade, BaseFacade);

/**
 * トップ
 *
 * @param {Object} params パラメータ
 * @param {number} params.userId ユーザID
 * @param {number} params.offset オフセット
 * @param {number} params.limit リミット
 * @param {Date} params.currentDatetime 現在日時
 * @param {function(Object result)} callback コールバック
 *     result: 投稿データ
 */
AuthFacade.prototype.login = function(params, callback) {
    try {
        validator.has(params, ['loginId', 'passward']);
        validator.string(params.loginId);
        validator.string(params.passward);

        validator.function(callback);
    } catch (error) {
        callback(error);
        return;
    }

    async.waterfall([
        function(callback) {
            userDao.getByLoginId(params.loginId, callback);
        },
        function(user, callback) {
            // パスワードが一致しない場合
            console.log(user);
            if (user && user.passward !== params.passward) {
                console.log('0000000000000');
                callback(null, {
                    invalidLogin: true,
                    userId: null
                });
                return;
            }

            userService.addUser({
                id: user ? user.id : null,
                deleteFlag: user ? user.deleteFlag : null,
                loginId: params.loginId,
                passward: params.passward,
                facebookId: params.facebookId,
                username: params.loginId,
                gender: params.gender,
                email: params.email,
                imagePath: params.imagePath
            }, function(error, userId) {
                if (error) {
                    callback(error);
                    return;
                }
                callback(null, {
                    invalidLogin: false,
                    userId: userId
                });
            });
        }
    ], function(error, result) {
        callback(error, {
            invalidLogin: result.invalidLogin,
            userId: result.userId
        });
    });
};

/**
 * トップ
 *
 * @param {Object} params パラメータ
 * @param {number} params.userId ユーザID
 * @param {number} params.offset オフセット
 * @param {number} params.limit リミット
 * @param {Date} params.currentDatetime 現在日時
 * @param {function(Object result)} callback コールバック
 *     result: ユーザID
 */
AuthFacade.prototype.facebookCallback = function(params, callback) {
    try {
        validator.has(params, ['facebookId', 'username', 'gender', 'email', 'imagePath', 'currentDatetime']);
        validator.string(params.facebookId);
        validator.string(params.username);
        validator.string(params.gender);
        validator.string(params.email);
        validator.date(params.currentDatetime);

        validator.function(callback);
    } catch (error) {
        callback(error);
        return;
    }

    async.waterfall([
        function(callback) {
            userDao.getByFacebookId(params.facebookId, callback);
        },
        function(user, callback) {
            userService.addUser({
                id: user ? user.id : null,
                deleteFlag: user ? user.deleteFlag : null,
                loginId: params.loginId,
                passward: params.passward,
                facebookId: params.facebookId,
                username: params.username,
                gender: params.gender,
                email: params.email,
                imagePath: params.imagePath
            }, callback);
        }
    ], function(error, userId) {
        callback(error, {
            invalidLogin: false,
            userId: userId
        });
    });
};

var facade = new AuthFacade();
facade.init();
module.exports = facade;
