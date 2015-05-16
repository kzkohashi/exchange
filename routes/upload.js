/**
 * @fileOverview upload page
 */

 // error handler
var errorHandler = require('errors/error');

// facade
var uploadFacade = require('models/facade/upload_facade');

exports.init = function(router) {
    router.get('/upload', function(request, response) {
        uploadFacade.index({
            userId: request.session.userId
        }, function(error, result) {
            if (error) {
                errorHandler.invalidRequest(response, error);
                return;
            }
            response.render('upload/index', result);
        });
    });

    router.post('/upload/execute', function(request, response) {

        // validation
        if (request.param('price')) {
            request.assert('price').isInt();
        }
        if (request.param('brandId')) {
            request.assert('brandId').isInt();
        }
        if (request.param('bagTypeId')) {
            request.assert('bagTypeId').isInt();
        }

        var errors = request.validationErrors();
        if (errors) {
            errorHandler.invalidRequest(response, error);
            return;
        }

        // sanitize
        var price = null;
        if (request.param('price')) {
            request.sanitize('price').toInt();
            price = request.param('price');
        }
        var brandId = null;
        if (request.param('brandId')) {
            request.sanitize('brandId').toInt();
            brandId = request.param('brandId');
        }
        var bagTypeId = null;
        if (request.param('bagTypeId')) {
            request.sanitize('bagTypeId').toInt();
            bagTypeId = request.param('bagTypeId');
        }

        uploadFacade.execute({
            userId: request.session.userId,
            description: request.param('description'),
            price: price,
            brandId: brandId,
            bagTypeId: bagTypeId,
            filePath: request.files.image.path,
            fileType: request.files.image.mimetype,
            currentDatetime: request.currentDatetime
        }, function(error, result) {
            if (error) {
                errorHandler.invalidRequest(response, error);
                return;
            }
            response.redirect('/');
        });
    });
}
