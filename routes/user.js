/**
 * @fileOverview user page
 */

// facade
// var indexFacade = require('models/facade/index_facade');

exports.init = function(router) {
    /* GET home page. */
    router.get('/user/:id', function(req, res) {
        res.render('user/index');
    });
}
