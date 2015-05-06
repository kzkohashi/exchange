// third party
var util = require('util');

// util
var validator = require('util/validator');

// base
var BaseJsonDao = require('models/dao/base_json_dao');

var BrandDao = function() {
    this.name = 'brand';
}
util.inherits(BrandDao, BaseJsonDao);

var dao = new BrandDao();
dao.init();
module.exports = dao;