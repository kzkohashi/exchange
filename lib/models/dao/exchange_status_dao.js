/**
 * @fileOverview ExchangeStatusDao
 */

// third party
var util = require('util');

// util
var validator = require('util/validator');
var Code = require('util/code');

// base
var BaseCodeJsonDao = require('models/dao/base_code_json_dao');

/**
 * exchange status dao
 *
 * @class ExchangeStatusDao
 */
var ExchangeStatusDao = function() {
    this.name = 'exchange_status';
    this.type = 'json';
}
util.inherits(ExchangeStatusDao, BaseCodeJsonDao);

ExchangeStatusDao.prototype.code = new Code([
    // 申請
    'request',
    // 申請キャンセル
    'requestCancel',
    // 拒否
    'reject',
    // 承認
    'approve'
])

var dao = new ExchangeStatusDao();
dao.init();
module.exports = dao;
