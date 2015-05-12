// third party
var util = require('util');
var _ = require('underscore');

// util
var validator = require('util/validator');

// base
var BaseDao = require('models/dao/base_dao');

var userGoodsDap = function() {
    this.name = 'user_goods';
}
util.inherits(userGoodsDap, BaseDao);

/**
 * idからポスト内容を取得
 * param {int} id ポストID
 * result {Object} post
 *
 **/
userGoodsDap.prototype.getById = function(id, callback) {
    try {
        validator.unsignedInteger(id);

        validator.function(callback);
    } catch (error) {
        callback(error);
        return;
    }

    var self = this;
    self.schema.findOne({
        id: id,
        deleteFlag: false
    }, callback);
}

/**
 * userIdから投稿を取得
 * param {int} userId
 * result {Object} post
 *
 **/
userGoodsDap.prototype.getListByUserIdAndOffsetLimit = function(params, callback) {
    try {
        validator.has(params, ['userId', 'offset', 'limit']);
        validator.unsignedInteger(params.userId);
        validator.integer(params.offset);
        validator.unsignedInteger(params.limit);

        validator.function(callback);
    } catch (error) {
        callback(error);
        return;
    }

    var self = this;

    self.schema.find({
        userId: params.userId,
        deleteFlag: false,
    })
    .sort({id: -1})
    .skip(params.offset * params.limit)
    .limit(params.limit)
    .exec(callback);
}

userGoodsDap.prototype.getListByIdList = function(idList, callback) {
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
        id: { $in: idList },
        deleteFlag: false
    })
    .sort({ updateDatetime: -1 })
    .exec(callback);
}

userGoodsDap.prototype.getListByOffsetLimit = function(params, callback) {
    try {
        validator.has(params, ['offset', 'limit']);
        validator.unsignedInteger(params.offset);
        validator.naturalInteger(params.limit);

        validator.function(callback);
    } catch (error) {
        callback(error);
        return;
    }

    var self = this;

    self.schema.find({
        deleteFlag: false
    })
    .sort({id: -1})
    .skip(params.offset * params.limit)
    .limit(params.limit)
    .exec(callback);
}

/**
 * postを新着順に取得
 **/
userGoodsDap.prototype.getListByBrandIdAndOffsetLimit = function(params, callback) {
    try {
        validator.has(params, ['brandId', 'offset', 'limit']);
        validator.naturalInteger(params.brandId);
        validator.unsignedInteger(params.offset);
        validator.naturalInteger(params.limit);

        validator.function(callback);
    } catch (error) {
        callback(error);
        return;
    }

    var self = this;
    var skip = (params.offset - 1) * params.limit;
    self.schema
    .find({
        brandId: params.brandId,
        deleteFlag: false
    })
    .sort({insertDatetime: -1})
    .skip(params.offset * params.limit)
    .limit(params.limit)
    .exec(callback);
}

/**
 * postを新着順に取得
 **/
userGoodsDap.prototype.getListByBagTypeIdAndOffsetLimit = function(params, callback) {
    try {
        validator.has(params, ['bagTypeId', 'offset', 'limit']);
        validator.naturalInteger(params.bagTypeId);
        validator.unsignedInteger(params.offset);
        validator.naturalInteger(params.limit);

        validator.function(callback);
    } catch (error) {
        callback(error);
        return;
    }

    var self = this;
    var skip = (params.offset - 1) * params.limit;
    self.schema
    .find({
        bagTypeId: params.bagTypeId,
        deleteFlag: false
    })
    .sort({insertDatetime: -1})
    .skip(params.offset * params.limit)
    .limit(params.limit)
    .exec(callback);
}

/**
 * 新規postをDBに追加
 *
 * param {Object} params
 * param {int} params.userId ユーザーID
 * param {string} params.iamgePath 画像パス
 * param {string} params.title タイトル
 * param {string} params.content 内容
 * param {string} params.date
 * param {string} params.place
 * param {string} params.address
 * result
 *
 **/
userGoodsDap.prototype.add = function(params, callback) {
    try {
        validator.has(params, ['userId', 'imagePath', 'price', 'description', 'brandId', 'bagTypeId']);
        validator.naturalInteger(params.userId);
        validator.string(params.imagePath);
        validator.unsignedInteger(params.price);
        validator.string(params.description);
        validator.naturalInteger(params.brandId);
        validator.naturalInteger(params.bagTypeId);

        validator.function(callback);
    } catch (error) {
        callback(error);
        return;
    }

    var schema = this.schema;
    var userGoods = new schema({
        userId: params.userId,
        imagePath: params.imagePath,
        title: params.title,
        price: params.price,
        description: params.description,
        brandId: params.brandId,
        bagTypeId: params.bagTypeId
    });

    userGoods.save(callback);
}

/**
 * 新規postをDBに追加
 *
 * param {Object} params
 * param {int} params.userId ユーザーID
 * param {string} params.iamgePath 画像パス
 * param {string} params.title タイトル
 * param {string} params.content 内容
 * param {string} params.date
 * param {string} params.place
 * param {string} params.address
 * result
 *
 **/
userGoodsDap.prototype.updateById = function(params, callback) {
    try {
        validator.has(params, ['postId', 'title', 'content', 'date', 'hour', 'money', 'place', 'address', 'url']);
        validator.unsignedInteger(params.postId);
        validator.string(params.title);
        if (params.content) {
            validator.string(params.content);
        }
        if (params.date) {
            validator.string(params.date);
        }
        if (params.hour) {
            validator.string(params.hour);
        }
        if (params.money) {
            validator.string(params.money);
        }
        if (params.place) {
            validator.string(params.place);
        }
        if (params.address) {
            validator.string(params.address);
        }
        if (params.url) {
            validator.string(params.url);
        }

        validator.function(callback);
    } catch (error) {
        callback(error);
        return;
    }

    var self = this;
    self.schema.update({postId: params.postId}, {
        $set: {
            // imagePath: params.imagePath,
            title: params.title,
            content: params.content,
            date: params.date,
            hour: params.hour,
            money: params.money,
            place: params.place,
            address: params.address,
            url: params.url,
            updateDatetime: new Date()
        }
    }, callback);
}

userGoodsDap.prototype.getCountByUserId = function(userId, callback) {
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
    }, function(error, data){
        if(error) {
            callback(error);
            return;
        }
        if(!data) return callback(null, 0);
        callback(null, data.length);
    });
};

/**
 * postを新着順に取得
 **/
userGoodsDap.prototype.newarrivalsByFollowedUserIdList = function(params, callback) {
    try {
        validator.has(params, ['followedUserIdList', 'offset', 'limit']);
        validator.array(params.followedUserIdList);
        _.each(params.followedUserIdList, function(followedUserId) {
            validator.unsignedInteger(followedUserId);
        });
        validator.integer(params.offset);
        validator.unsignedInteger(params.limit);

        validator.function(callback);
    } catch (error) {
        callback(error);
        return;
    }

    var self = this;
    var skip = (params.offset - 1) * params.limit;
    self.schema.find({
        deleteFlag: false,
        userId: {
            $in: params.followedUserIdList
        }
    })
    .sort({insertDatetime: -1})
    .skip(skip)
    .limit(params.limit)
    .exec(callback);
}

/**
 *
 **/
userGoodsDap.prototype.getListByFollowedUserIdListAndLimit = function(params, callback) {
    try {
        validator.has(params, ['followedUserIdList', 'limit', 'lessThanId']);
        _.each(params.followedUserIdList, function(followedUserId) {
            validator.unsignedInteger(followedUserId);
        });
        validator.unsignedInteger(params.limit);
        validator.unsignedInteger(params.lessThanId);

        validator.function(callback);
    } catch (error) {
        callback(error);
        return;
    }

    var self = this;
    self.schema.find({
        deleteFlag: false,
        postId: { $lt: params.lessThanId },
        userId: { $in: params.followedUserIdList }
    })
    .sort({insertDatetime: -1})
    .limit(params.limit)
    .exec(callback);
}

/**
 * post件数を取得
 **/
userGoodsDap.prototype.getUserPostCount = function(userId, callback) {
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

/**
 * 削除
 **/
userGoodsDap.prototype.delete = function(id, callback) {
    try {
        validator.unsignedInteger(id);

        validator.function(callback);
    } catch (error) {
        callback(error);
        return;
    }

    var self = this;
    self.schema.update({
        postId: id
    },
    {
        $set: {
            deleteFlag: true
        }
    }, callback);
};

var dao = new userGoodsDap();
dao.init();
module.exports = dao;
