// third party
var util = require('util');
var _ = require('underscore');

// util
var validator = require('util/validator');

// base
var BaseDao = require('models/dao/base_dao');

/**
 * userGoodsDao
 *
 * @class userGoodsDao
 */
var userGoodsDao = function() {
    this.name = 'user_goods';
    this.type = 'mongodb';
}
util.inherits(userGoodsDao, BaseDao);

/**
 * idからポスト内容を取得
 * param {int} id ポストID
 * result {Object} post
 *
 **/
userGoodsDao.prototype.getById = function(id, callback) {
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
userGoodsDao.prototype.getListByUserIdAndOffsetLimit = function(params, callback) {
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

userGoodsDao.prototype.getListByIdList = function(idList, callback) {
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

userGoodsDao.prototype.getListByOffsetLimit = function(params, callback) {
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
userGoodsDao.prototype.getListByBrandIdAndOffsetLimit = function(params, callback) {
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
userGoodsDao.prototype.getListByBagTypeIdAndOffsetLimit = function(params, callback) {
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
userGoodsDao.prototype.add = function(params, callback) {
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
userGoodsDao.prototype.updateById = function(params, callback) {
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

/**
 * 削除
 **/
userGoodsDao.prototype.delete = function(id, callback) {
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

var dao = new userGoodsDao();
dao.init();
module.exports = dao;
