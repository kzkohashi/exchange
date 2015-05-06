// third party
var util = require('util');

// util
var validator = require('util/validator');

// base
var BaseJsonDao = require('dao/baseJsonDao');

var BagTypeDao = function() {
    this.name = 'brand';
}
util.inherits(BagTypeDao, BaseJsonDao);

var dao = new BagTypeDao();
dao.init();
module.exports = dao;