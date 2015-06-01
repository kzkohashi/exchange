/**
 * @fileOverview top page
 */

// error handler
var errorHandler = require('errors/error');

// facade
var exchangeFacade = require('models/facade/exchange_facade');

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
            // console.log(result)
            response.render('exchange/list', result);
        });
    });

    router.get('/exchange/request', function(request, response) {

        // validation
        if (request.param('userExchangeGoodsSequenceId')) {
            request.assert('userExchangeGoodsSequenceId').isInt();
        }

        var errors = request.validationErrors();
        if (errors) {
            errorHandler.invalidRequest(response, error);
            return;
        }

        // sanitize
        var userExchangeGoodsSequenceId = null;
        if (request.param('userExchangeGoodsSequenceId')) {
            request.sanitize('userExchangeGoodsSequenceId').toInt();
            hostUserId = request.param('userExchangeGoodsSequenceId');
        }

        exchangeFacade.reject({
            userId: request.session.userId,
            userExchangeGoodsSequenceId: userExchangeGoodsSequenceId,
            currentDatetime: request.currentDatetime
        }, function(error, result) {
            if (error) {
                errorHandler.index(response, error);
                return;
            }
            // console.log(result);
            response.redirect('/goods?userGoodsId=' + userGoodsId);
        });
    });
}
