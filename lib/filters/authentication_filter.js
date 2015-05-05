exports.index = {
    filter: function(request, response, next) {
        if (!request.session.userId) {
            response.redirect('auth');
            return;
        }
        next();
    }
};