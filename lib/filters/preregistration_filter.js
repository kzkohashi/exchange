exports.index = {
    filter: function(request, response, next) {
      response.redirect('preregistration');
      next();
    }
};