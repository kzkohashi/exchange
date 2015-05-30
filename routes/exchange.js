/**
 * @fileOverview top page
 */

// error handler
var errorHandler = require('errors/error');

// facade
var exchangeFacade = require('models/facade/echange_facade');

exports.init = function(router) {

    router.get('/exchange/list', function(request, response) {
        exchangeFacade.list({
            userId: request.session.userId,
            currentDatetime: request.currentDatetime
        }, function(error, result) {
            if (error) {
                errorHandler.index(response, error);
                return;
            }
            response.render('goods/index', result);
        });
    });

    router.post('/exchange/request', function(request, response) {

        // validation
        if (request.param('userGoodsId')) {
            request.assert('userGoodsId').isInt();
        }
        if (request.param('exchangeUserGoodsId')) {
            request.assert('exchangeUserGoodsId').isInt();
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

        var exchangeUserGoodsId = null;
        if (request.param('exchangeUserGoodsId')) {
            request.sanitize('exchangeUserGoodsId').toInt();
            exchangeUserGoodsId = request.param('exchangeUserGoodsId');
        }

        exchangeFacade.request({
            userId: request.session.userId,
            userGoodsId: userGoodsId,
            exchangeUserGoodsId: exchangeUserGoodsId,
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
