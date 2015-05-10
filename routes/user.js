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

        // validation
        if (request.param('offset')) {
            request.assert('offset').isInt();
        }
        if (request.param('limit')) {
            request.assert('limit').isInt();
        }

        var errors = request.validationErrors();
        if (errors) {
            errorHandler.invalidRequest(response, error);
            return;
        }

        // sanitize
        var offset = 0;
        if (request.param('offset')) {
            request.sanitize('offset').toInt();
            offset = request.param('offset')
        }
        var limit = 12;
        if (request.param('limit')) {
            request.sanitize('limit').toInt();
            limit = request.param('limit')
        }

        userFacade.index({
            userId: request.session.userId,
            offset: offset,
            limit: limit,
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
