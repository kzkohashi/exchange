/**
 * @fileOverview top page
 */

// error handler
var errorHandler = require('errors/error');

// facade
var indexFacade = require('models/facade/index_facade');

exports.init = function(router) {
    /* GET home page. */
    router.get('/', function(request, response) {
        indexFacade.index({
          userId: request.session.userId
        }, function(error, result) {
            if (error) {
                errorHandler.invalidRequest(response, error);
                return;
            }
            console.log(result);
            response.render('index', result);
        });
    });
}
