// third party
var util = require('util');
var _ = require('underscore');

// util
var validator = require('util/validator');

// base
var BaseDao = require('models/dao/base_dao');

var CommentDao = function() {
    this.name = 'comment'
};
util.inherits(CommentDao, BaseDao)

/**
 * 新規commentをDBに追加
 * param {Object} params
 *
 **/
CommentDao.prototype.add = function(params, callback) {
    try {
        validator.has(params, ['userId', 'userGoodsId', 'comment']);
        validator.unsignedInteger(params.userId);
        validator.unsignedInteger(params.postId);
        validator.string(params.comment);

        validator.function(callback);
    } catch (error) {
        callback(error);
        return;
    }

    var schema = this.schema;
    var comment = new schema({
        userId: params.userId,
        userGoodsId: params.userGoodsId,
        comment: params.comment
    });
    comment.save(callback);
};

CommentDao.prototype.getListByUserIdAndUpdateDatetimeLimit = function(params, callback) {
    try {
        validator.has(params, ['userId', 'updateDatetime', 'limit']);
        validator.unsignedInteger(params.userId);
        validator.date(params.updateDatetime);
        validator.unsignedInteger(params.limit);

        validator.function(callback);
    } catch (error) {
        callback(error);
        return;
    }

    var self = this;

    self.schema.aggregate()
    .match({
        userId: params.userId,
        updateDatetime: { $lt: params.updateDatetime },
        deleteFlag: false
    })
    .group({ _id: "$postId", updateDatetime: { $addToSet: "$updateDatetime"}})
    .sort({ updateDatetime: -1})
    .limit(params.limit)
    .exec(callback);
}

CommentDao.prototype.getListByUserGoodsIdList = function(userGoodsIdList, callback) {
    try {
        validator.array(userGoodsIdList);
        _.each(userGoodsIdList, function(userGoodsId) {
            validator.unsignedInteger(userGoodsId);
        });

        validator.function(callback);
    } catch (error) {
        callback(error);
        return;
    }

    var self = this;
    self.schema.find({
        postId: {
            $in: userGoodsIdList
        }
    })
    .exec(callback);
}

CommentDao.prototype.getListByPostIdAndUpdateDatetimeLimit = function(params, callback) {
    try {
        validator.has(params, ['userGoodsId', 'updateDatetime', 'limit']);
        validator.unsignedInteger(params.userGoodsId);
        validator.date(params.updateDatetime);

        validator.function(callback);
    } catch (error) {
        callback(error);
        return;
    }

    var self = this;
    self.schema.find({
        userGoodsId: params.userGoodsId,
        updateDatetime: {$lt: params.updateDatetime},
        deleteFlag: false,
    })
    .sort({updateDatetime: -1})
    .limit(params.limit)
    .exec(callback);
};


CommentDao.prototype.getCountByUserGoodsId = function(userGoodsId, callback) {
    try {
        validator.unsignedInteger(userGoodsId);

        validator.function(callback);
    } catch (error) {
        callback(error);
        return;
    }

    var self = this;
    self.schema.find({
        userGoodsId: userGoodsId,
        deleteFlag: false,
    }, function(err, data){
        if(err) {
            callback(err);
            return;
        }
        if(!data) return callback(0);
        callback(null, data.length);
    });
};

CommentDao.prototype.getCountByUserId = function(userId, callback) {
    try {
        validator.unsignedInteger(userId);

        validator.function(callback);
    } catch (error) {
        callback(error);
        return;
    }

    var self = this;
    self.schema.find({
        userId: userId,
        deleteFlag: false,
    }, function(err, data){
        if(err) {
            callback(err);
            return;
        }
        if(!data) return callback(null, 0);
        callback(null, data.length);
    });
};

CommentDao.prototype.getListByUserId = function(userId, callback) {
    try {
        validator.unsignedInteger(userId);

        validator.function(callback);
    } catch (error) {
        callback(error);
        return;
    }

    var self = this;
    self.schema.find({
        userId: userId,
        deleteFlag: false,
    })
    .sort({insertDatetime: -1})
    .exec(callback);
};

CommentDao.prototype.deleteById = function(id, callback) {
    try {
        validator.naturalInteger(id);

        validator.function(callback);
    } catch (error) {
        callback(error);
        return;
    }

    var self = this;
    self.schema.update({
        idd: id
    },
    {
        $set: {
            deleteFlag: true
        }
    }, callback);
};

CommentDao.prototype.deleteAllByUserGoddsId = function(userGoodsId, callback) {
    try {
        validator.unsignedInteger(userGoodsId);

        validator.function(callback);
    } catch (error) {
        callback(error);
        return;
    }

    var self = this;
    self.schema.update({
        userGoodsId: userGoodsId
    },
    {
        $set: {
            deleteFlag: true
        }
    },
    {
        multi: true
    }, callback);
};

var dao = new CommentDao();
dao.init();
module.exports = dao;
