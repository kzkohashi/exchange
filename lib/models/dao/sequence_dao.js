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
 * user dao
 *
 * @class user dao
 */
var SequenceDao = function() {
    this.name = 'sequence';
    this.type = 'mongodb';
}
util.inherits(SequenceDao, BaseDao);

/**
 * 新規userをDBに追加
 * param {Object} params
 * result
 *
 **/
SequenceDao.prototype.add = function(params, callback) {
    var schema = this.schema;
    var sequence = new schema({
        typeId: params.typeId
    });
    sequence.save(callback);
}

/**
 * idからuserを取得
 * param {int} id
 * result {Object} user
 *
 **/
SequenceDao.prototype.getByTypeId = function(typeId, callback) {
    try {
        validator.unsignedInteger(typeId);

        validator.function(callback);
    } catch (error) {
        callback(error);
        return;
    }

    var self = this;
    self.schema
        .findOneAndUpdate(
            {
                typeId: typeId
            },
            {
                $inc: {sequenceId: 1}
            },
            {upsert: true}, callback);
}

var dao = new SequenceDao();
dao.init();
module.exports = dao;
