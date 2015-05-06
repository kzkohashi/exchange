/**
 * @fileOverview user page
 */

// error handler
var errorHandler = require('errors/error');

// facade
var userFacade = require('models/facade/user_facade');

exports.init = function(router) {
    /* GET home page. */
    router.get('/user/:userPageId', function(request, response) {
        userFacade.index({
            userId: request.session.userId,
            userPageId: parseInt(request.param('userPageId'))
        }, function(error, result) {
            if (error) {
                errorHandler.invalidRequest(response, error);
                return;
            }
            console.log(result)
            response.render('user/index', result);
        });
    });
}
