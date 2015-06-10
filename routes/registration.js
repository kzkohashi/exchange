/**
 * @fileOverview top page
 */

// error handler
var errorHandler = require('errors/error');

// facade
var indexFacade = require('models/facade/index_facade');

exports.init = function(router) {

    router.get('/registration', function(request, response) {

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
        var limit = 20;
        if (request.param('limit')) {
            request.sanitize('limit').toInt();
            limit = request.param('limit')
        }

        registrationFacade.index({
            offset: offset,
            limit: limit,
            currentDatetime: request.currentDatetime
        }, function(error, result) {
            if (error) {
                errorHandler.index(response, error);
                return;
            }
            response.render('registration/index', result);
        });
    });
}
