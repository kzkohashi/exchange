/**
 * @fileOverview top page
 */

// error handler
var errorHandler = require('errors/error');

// facade
var preregistrationFacade = require('models/facade/preregistraion_facade');

exports.init = function(router) {

    router.get('/preregistration', function(request, response) {

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

        preregistrationFacade.index({
            offset: offset,
            limit: limit,
            currentDatetime: request.currentDatetime
        }, function(error, result) {
            if (error) {
                errorHandler.index(response, error);
                return;
            }
            response.render('preregistration/index', result);
        });
    });

    router.post('/preregistration/execute', function(request, response) {

        preregistrationFacade.execute({
            email: request.param('email'),
            currentDatetime: request.currentDatetime
        }, function(error, result) {
            if (error) {
                errorHandler.index(response, error);
                return;
            }
            response.redirect('/preregistration');
        });
    });

    router.post('/preregistration/upload', function(request, response) {

        preregistrationFacade.upload({
            filePath: request.files.image.path,
            fileType: request.files.image.mimetype,
            currentDatetime: request.currentDatetime
        }, function(error, result) {
            if (error) {
                errorHandler.index(response, error);
                return;
            }
            response.redirect('/preregistration');
        });
    });

    router.post('/preregistration/comment', function(request, response) {

        // validation
        if (request.param('preregistrationGoodsId')) {
            request.assert('preregistrationGoodsId').isInt();
        }

        var errors = request.validationErrors();
        if (errors) {
            errorHandler.invalidRequest(response, error);
            return;
        }

        // sanitize
        var preregistrationGoodsId = null;
        if (request.param('preregistrationGoodsId')) {
            request.sanitize('preregistrationGoodsId').toInt();
            preregistrationGoodsId = request.param('preregistrationGoodsId');
        }

        preregistrationFacade.comment({
            preregistrationGoodsId: preregistrationGoodsId,
            comment: request.param('comment'),
            currentDatetime: request.currentDatetime
        }, function(error, result) {
            if (error) {
                errorHandler.index(response, error);
                return;
            }
            response.send(result);
        });
    });

    router.post('/preregistration/like', function(request, response) {

        // validation
        if (request.param('preregistrationGoodsId')) {
            request.assert('preregistrationGoodsId').isInt();
        }

        var errors = request.validationErrors();
        if (errors) {
            errorHandler.invalidRequest(response, error);
            return;
        }

        // sanitize
        var preregistrationGoodsId = null;
        if (request.param('preregistrationGoodsId')) {
            request.sanitize('preregistrationGoodsId').toInt();
            preregistrationGoodsId = request.param('preregistrationGoodsId');
        }

        preregistrationFacade.like({
            preregistrationGoodsId: preregistrationGoodsId,
            currentDatetime: request.currentDatetime
        }, function(error, result) {
            if (error) {
                errorHandler.index(response, error);
                return;
            }
            response.send(result);
        });
    });
}
