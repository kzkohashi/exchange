
// third party
var async = require('async');
var _ = require('underscore');

// util
var validator = require('util/validator');

// mongo dao
var userDao = require('models/dao/user_dao');
var commentDao = require('models/dao/comment_dao');

// コメント取得
var CommentService = function() {
    this.name = 'comment';
}

CommentService.prototype.getListByUserGoodsIdAndOffsetLimit = function(params, callback) {
    try {
        validator.has(params, ['userGoodsId', 'offset', 'limit']);
        validator.naturalInteger(params.userGoodsId);
        validator.unsignedInteger(params.offset);
        validator.naturalInteger(params.limit);

        validator.function(callback);
    } catch (error) {
        callback(error);
        return;
    }

    async.waterfall([
        // コメント取得
        function(callback) {
            commentDao.getListByUserGoodsIdAndOffsetLimit({
                userGoodsId: params.userGoodsId,
                offset: params.offset,
                limit: params.limit
            }, callback);
        },
        // ユーザ情報を取得
        function(commentList, callback) {
            userDao.getMapByIdList(_.uniq(_.pluck(commentList, 'userId')), function(error, userMap) {
                if (error) {
                    callback(error);
                    return;
                }
                _.each(commentList, function(comment) {
                    comment.user = userMap[comment.userId];
                });
                callback(null, commentList);
            });
        }
    ], callback);
}

var service = new CommentService();
module.exports = service;
