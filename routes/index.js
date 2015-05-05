/**
 * @fileOverview top page
 */

// facade
var indexFacade = require('models/facade/index_facade');

exports.init = function(router) {

    /* GET home page. */
    router.get('/', function(req, res) {
        res.render('index');
    });
}
