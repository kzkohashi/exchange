/**
 * @fileOverview SequenceTypeDao
 */

// third party
var util = require('util');

// util
var Code = require('util/code');

// base
var BaseCodeJsonDao = require('models/dao/base_code_json_dao');

/**
 * SequenceTypeDao
 *
 * @class SequenceTypeDao
 */
var SequenceTypeDao = function() {
    this.name = 'sequence_type';
    this.type = 'json';
}
util.inherits(SequenceTypeDao, BaseCodeJsonDao);

SequenceTypeDao.prototype.code = new Code([
    // 交換シーケンスID
    'userExchangeSequence'
])

var dao = new SequenceTypeDao();
dao.init();
module.exports = dao;
