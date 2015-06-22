'use strict'
requirejs.config(configure.get('requirejsSettings'));

require([
    'backbone'
], function() {
    var AppRouter = Backbone.Router.extend({
        routes: {
            '': 'index'
        },
        initialize: function() {
            var preregistrationGoodsId;
            var comment;
            $('.comment-request').click(function() {
                var preregistrationGoodsId = $(this).data('preregistration-goods-id');
                var element = document.getElementById(preregistrationGoodsId);
                $.ajax({
                    type: 'POST',
                    url: '/preregistration/comment',
                    data: {
                        preregistrationGoodsId: preregistrationGoodsId,
                        comment: element.value
                    },
                    success: function(data) {
                        $('#comment-' + preregistrationGoodsId).append('<p>' + element.value + '</p>');
                        element.value = '';
                    },
                    error: function(){
                    }
                });
            });
        }
    });
    window.router = new AppRouter();
    Backbone.history.start({pushState: false, hashChange: false});
});
