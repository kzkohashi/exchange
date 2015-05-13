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

        goodsFacade.index({
          userId: request.session.userId,
          userGoodsId: userGoodsId,
          currentDatetime: request.currentDatetime
        }, function(error, result) {
            if (error) {
                errorHandler.index(response, error);
                return;
            }
            response.render('goods/index', result);
        });
    });
}
