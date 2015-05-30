// third party
var util = require('util');

// util
var validator = require('util/validator');

// base
var BaseJsonDao = require('models/dao/base_json_dao');

var BagTypeDao = function() {
    this.name = 'bag_type';
    this.type = 'json';
}
util.inherits(BagTypeDao, BaseJsonDao);

var dao = new BagTypeDao();
dao.init();
module.exports = dao;