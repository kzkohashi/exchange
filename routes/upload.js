/**
 * @fileOverview upload page
 */

 // error handler
var errorHandler = require('errors/error');

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

    router.post('/upload/execute', function(request, response) {

        var data = request.body;
        var title = data.title;
        var description = data.description;
        var price = parseInt(data.price);
        var brandId = parseInt(data.brandId);
        var bagTypeId = parseInt(data.bagTypeId);
console.log(data);
console.log(request.files);
        uploadFacade.execute({
            userId: request.session.userId,
            title: title,
            description: description,
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
            console.log(result);
            response.render('upload/index', result);
        });
    });
}
