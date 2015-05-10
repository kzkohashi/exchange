/**
 * @fileOverview top page
 */

// error handler
var errorHandler = require('errors/error');

// facade
var indexFacade = require('models/facade/index_facade');

exports.init = function(router) {

    router.get('/', function(request, response) {
        indexFacade.index({
          userId: request.session.userId,
          offset: offset,
          limit: limit,
          currentDatetime: request.currentDatetime
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
