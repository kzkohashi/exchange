var userDao = require('models/dao/user_dao');

exports.init = function(router) {

    /* GET home page. */
    router.get('/', function(req, res, next) {
        res.render('index', { title: 'Express' });
    });
}
