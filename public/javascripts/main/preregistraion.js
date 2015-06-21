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
                console.log('1111111111111');
                console.log(preregistrationGoodsId);
                console.log(element.value);
                $.ajax({
                    type: 'GET',
                    url: '/preregistration/comment',
                    data: {
                        preregistrationGoodsId: preregistrationGoodsId,
                        comment: element.value
                    },
                    success: function(data) {
                        console.log('success');
                        console.log(data);
                    },
                    error: function(){
                    }
                });
            });
        },
        index: function() {}
    });
    window.router = new AppRouter();
    Backbone.history.start({pushState: false, hashChange: false});
});
