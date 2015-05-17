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
            // ログアウトしていた場合
            if (user && user.deleteFlag === false) {
                callback(null, user.id);
                return;
            }

            // アカウント削除していた場合
            if (user && user.deleteFlag) {
                userDao.updateByUserId({
                    id: user.id,
                    updateParameter: {
                        deleteFlag: false
                    }
                }, function(error, result) {
                    if (error) {
                        callback(error);
                        return;
                    }
                    callback(null, user.id);
                });
                return;
            }

            userDao.add({
                facebookId: params.facebookId,
                username: params.username,
                gender: params.gender,
                email: params.email,
                imagePath: params.imagePath
            }, function(error, result) {
                if(error) {
                    callback(error);
                    return;
                }
                callback(null, result.id);
            });
        }
    ], function(error, userId) {
        callback(error, {
            userId: userId
        });
    });
};

var facade = new AuthFacade();
facade.init();
module.exports = facade;
