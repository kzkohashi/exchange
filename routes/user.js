/**
 * @fileOverview user page
 */

// error handler
var errorHandler = require('errors/error');

// facade
var userFacade = require('models/facade/user_facade');

exports.init = function(router) {

    router.get('/user', function(request, response) {

        // validation
        if (request.param('userId')) {
            request.assert('userId').isInt();
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
        var userId = null;
        if (request.param('userId')) {
            request.sanitize('userId').toInt();
            userId = request.param('userId')
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

        userFacade.index({
            userId: request.session.userId,
            offset: offset,
            limit: limit,
            userPageId: userId
        }, function(error, result) {
            if (error) {
                errorHandler.invalidRequest(response, error);
                return;
            }
            response.render('user/index', result);
        });
    });

    router.get('/user/edit', function(request, response) {

        userFacade.edit({
            userId: request.session.userId,
            currentDatetime: request.currentDatetime
        }, function(error, result) {
            if (error) {
                errorHandler.invalidRequest(response, error);
                return;
            }
            response.render('user/edit', result);
        });
    });

    router.get('/user/edit_image_path', function(request, response) {

        userFacade.edit({
            userId: request.session.userId,
            filePath: request.files.image.path,
            fileType: request.files.image.mimetype,
            currentDatetime: request.currentDatetime
        }, function(error, result) {
            if (error) {
                errorHandler.invalidRequest(response, error);
                return;
            }
            response.render('user/edit', result);
        });
    });
}
