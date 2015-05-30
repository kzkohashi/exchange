/**
 * @fileOverview ExchangeStatusDao
 */

// third party
var util = require('util');

// util
var validator = require('util/validator');
var Code = require('util/code');

// base
var BaseJsonDao = require('models/dao/base_json_dao');

/**
 * exchange status dao
 *
 * @class ExchangeStatusDao
 */
var ExchangeStatusDao = function() {
    this.name = 'exchane_status';
}
util.inherits(ExchangeStatusDao, BaseJsonDao);

ExchangeStatusDao.prototype.code = new Code([
    // 申請
    'request',
    // 拒否
    'reject',
    // 承認
    'approve'
])

var dao = new ExchangeStatusDao();
dao.init();
module.exports = dao;
