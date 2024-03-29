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
 * @param {number} params.loginId ログインID
 * @param {number} params.passward パスワード
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
        // ユーザ取得
        function(callback) {
            userDao.getByLoginId(params.loginId, callback);
        },
        // ユーザ追加
        function(user, callback) {
            // パスワードが一致しない場合
             if (user && user.passward !== params.passward) {
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
                username: params.loginId
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
 * @param {number} params.facdeBookId　フェイスブック ID
 * @param {number} params.username ユーザーネーム
 * @param {number} params.gender 性別
 * @param {Date} params.email Eメールアドレス
 * @param {Date} params.imagePath イメージパス
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
        // ユーザ取得
        function(callback) {
            userDao.getByFacebookId(params.facebookId, callback);
        },
        // ユーザ追加
        function(user, callback) {
            userService.addUser({
                id: user ? user.id : null,
                deleteFlag: user ? user.deleteFlag : null,
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
