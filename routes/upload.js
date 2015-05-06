/**
 * @fileOverview upload page
 */

// facade
var uploadFacade = require('models/facade/upload_facade');

exports.init = function(router) {
    /* GET home page. */
    router.get('/upload', function(request, response) {
        uploadFacade.index({
          userId: request.session.userId
        }, function(error, result) {
            if (error) {
                errorHandler.invalidRequest(response, error);
                return;
            }
            console.log(result);
            response.render('upload/index', result);
        });
    });
}
