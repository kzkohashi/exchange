/**
 * @fileOverview top page
 */

// error handler
var errorHandler = require('errors/error');

// facade
var goodsFacade = require('models/facade/goods_facade');

exports.init = function(router) {

    router.get('/goods', function(request, response) {

        // validation
        if (request.param('userGoodsId')) {
            request.assert('userGoodsId').isInt();
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
        var userGoodsId = null;
        if (request.param('userGoodsId')) {
            request.sanitize('userGoodsId').toInt();
            userGoodsId = request.param('userGoodsId');
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

        goodsFacade.index({
            userId: request.session.userId,
            userGoodsId: userGoodsId,
            offset: offset,
            limit: limit,
            currentDatetime: request.currentDatetime
        }, function(error, result) {
            if (error) {
                errorHandler.index(response, error);
                return;
            }
            response.render('goods/index', result);
        });
    });

    router.post('/goods/comment', function(request, response) {

        // validation
        if (request.param('userGoodsId')) {
            request.assert('userGoodsId').isInt();
        }

        var errors = request.validationErrors();
        if (errors) {
            errorHandler.invalidRequest(response, error);
            return;
        }

        // sanitize
        var userGoodsId = null;
        if (request.param('userGoodsId')) {
            request.sanitize('userGoodsId').toInt();
            userGoodsId = request.param('userGoodsId');
        }

        goodsFacade.comment({
            userId: request.session.userId,
            userGoodsId: userGoodsId,
            comment: request.param('comment'),
            currentDatetime: request.currentDatetime
        }, function(error, result) {
            if (error) {
                errorHandler.index(response, error);
                return;
            }
            response.redirect('/goods?userGoodsId=' + userGoodsId);
        });
    });
}
