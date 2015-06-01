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
            console.log(result)
            response.render('exchange/list', result);
        });
    });

    router.get('/exchange/request', function(request, response) {

        // validation
        if (request.param('hostUserId')) {
            request.assert('hostUserId').isInt();
        }
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
        var hostUserId = null;
        if (request.param('hostUserId')) {
            request.sanitize('hostUserId').toInt();
            hostUserId = request.param('hostUserId');
        }

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
            hostUserId: hostUserId,
            userId: request.session.userId,
            userGoodsId: userGoodsId,
            exchangeUserGoodsId: exchangeUserGoodsId,
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

    router.get('/exchange/reject', function(request, response) {

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
            response.redirect('/goods?userGoodsId=' + userGoodsId);
        });
    });

    router.get('/exchange/approve', function(request, response) {

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
            userExchangeGoodsSequenceId = request.param('userExchangeGoodsSequenceId');
        }

        exchangeFacade.approve({
            userId: request.session.userId,
            userExchangeGoodsSequenceId: userExchangeGoodsSequenceId,
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
