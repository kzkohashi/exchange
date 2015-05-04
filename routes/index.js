/**
 * @fileOverview top page
 */

var userDao = require('models/dao/user_dao');

// facade
var indexFacade = require('models/facade/index_facade');

exports.init = function(router) {

    /* GET home page. */
    router.get('/', function(req, res, next) {
        res.render('index', { title: 'Express' });
    });
}
