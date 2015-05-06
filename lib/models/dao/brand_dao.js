// third party
var util = require('util');

// util
var validator = require('util/validator');

// base
var BaseJsonDao = require('dao/baseJsonDao');

var BrandDao = function() {
    this.name = 'brand';
}
util.inherits(BrandDao, BaseJsonDao);

var dao = new BrandDao();
dao.init();
module.exports = dao;