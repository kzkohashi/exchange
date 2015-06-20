
// third party
var async = require('async');
var _ = require('underscore');

// util
var validator = require('util/validator');

// dao
var userDao = require('models/dao/user_dao');

/**
 * UserService
 *
 * @class UserService
 */
var UserService = function() {
    this.name = 'User';
}

/**
 * 新規ユーザ追加
 *
 * @param {Object} params パラメータ
 * @param {number} params.id ユーザID
 * @param {string} params.deleteFlag 削除フラグ
 * @param {string} params.facadeBookId フェイスブックID
 * @param {string} params.username ユーザネーム
 * @param {string} params.gender 性別
 * @param {string} params.email メールアドレス
 * @param {string} params.imagePath イメージパス
 * @param {function(Object result)} callback コールバック
 *     result: ユーザID
 */
UserService.prototype.addUser = function(params, callback) {
    try {
        if (params.id) {
            validator.naturalInteger(params.id);
        }
        if (params.haOwnProperty('loginId')) {
            validator.string(params.loginId);
        }
        if (params.haOwnProperty('facebookId')) {
            validator.string(params.facebookId);
        }
        if (params.haOwnProperty('username')) {
            validator.string(params.username);
        }
        if (params.haOwnProperty('gender')) {
            validator.string(params.gender);
        }
        if (params.haOwnProperty('email')) {
            validator.string(params.email);
        }
        if (params.haOwnProperty('imagePath')) {
            validator.string(params.imagePath);
        }
        if (params.haOwnProperty('deleteFlag')) {
            validator.boolean(params.deleteFlag);
        }

        validator.function(callback);
    } catch (error) {
        callback(error);
        return;
    }

    // ログアウトしていた場合
    if (params.id && params.deleteFlag === false) {
        callback(null, params.id);
        return;
    }

    // アカウント削除していた場合
    if (params.id && params.deleteFlag) {
        userDao.updateByUserId({
            id: params.id,
            updateParameter: {
                deleteFlag: false
            }
        }, function(error, result) {
            if (error) {
                callback(error);
                return;
            }
            callback(null, params.id);
        });
        return;
    }

    // 新規ユーザ追加
    userDao.add({
        loginId: params.loginId,
        passward: params.passward,
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

var service = new UserService();
module.exports = service;
