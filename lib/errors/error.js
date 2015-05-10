var errorJson = require('error/error');

exports.index = function(response, error) {
    var stackTrace = null;

    if (error instanceof Error) {
        stackTrace = error;
        stackTrace.stack += "\n" + new Error().stack.replace(/^Error/, 'Trace');
    }
    var status = 500;
    response.render('error/index', {
        content: errorJson.common,
        status: status,
        stackTrace: stackTrace
    });
};

exports.invalidRequest = function(response, error) {
    response.status(status);

    var stackTrace = null;
    if (error instanceof Error) {
        stackTrace = error;
        stackTrace.stack += "\n" + new Error().stack.replace(/^Error/, 'Trace');
    }

    var status = 400;
    response.render('error/index', {
        content: errorJson.common,
        status: status,
        stackTrace: stackTrace
    });
};