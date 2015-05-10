/**
 * @fileOverview category page
 */

// error handler
var errorHandler = require('errors/error');

// facade
var categoryFacade = require('models/facade/category_facade');

exports.init = function(router) {

    router.get('/category/brand', function(request, response) {

        // validation
        if (request.param('brandId')) {
            request.assert('brandId').isInt();
        }
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
        var brandId = null;
        if (request.param('brandId')) {
            request.sanitize('brandId').toInt();
            brandId = request.param('brandId')
        }
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

        categoryFacade.index({
          userId: request.session.userId,
          brandId: brandId,
          offset: offset,
          limit: limit,
          currentDatetime: request.currentDatetime
        }, function(error, result) {
            if (error) {
                errorHandler.index(response, error);
                return;
            }
            console.log(result)
            response.render('index', result);
        });
    });
}
