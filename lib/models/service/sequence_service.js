
// third party
var async = require('async');
var _ = require('underscore');

// util
var validator = require('util/validator');

// mater dao
var sequenceTypeDao = require('models/dao/sequence_type_dao');

// mongo dao
var sequenceDao = require('models/dao/sequence_dao');

// コメント取得
var SequenceService = function() {
    this.name = 'comment';
}

/**
 * シーケンスIDを取得
 *
 * @param {string} SequenceTypeCode シーケンスタイプコード
 * @param {function(Object result)} callback コールバック
 *     result: アップロード結果
 */
SequenceService.prototype.getSequenceIdBySequenceTypeCode = function(SequenceTypeCode, callback) {
    try {
        validator.string(SequenceTypeCode);

        validator.function(callback);
    } catch (error) {
        callback(error);
        return;
    }

    async.waterfall([
        // seqenceTypeを取得
        function(callback) {
            sequenceTypeDao.getByCode(SequenceTypeCode, callback);
        },
        // sequenceIdを取得
        function(sequenceType, callback) {
            sequenceDao.getByTypeId(sequenceType.id, function(error, sequence) {
                if (error) {
                    callback(error);
                    return;
                }
                callback(null, sequence.sequenceId);
            });
        }
    ], callback);
}

var service = new SequenceService();
module.exports = service;
