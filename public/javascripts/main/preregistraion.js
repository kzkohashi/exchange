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
                        document.getElementById('goods-' + preregistrationGoodsId).style.marginBottom = '100px';
                    },
                    error: function() {
                    }
                });
            });

            $('.like-request').click(function() {
                var element = $(this);
                var preregistrationGoodsId = element.data('preregistration-goods-id');
                $.ajax({
                    type: 'POST',
                    url: '/preregistration/like',
                    data: {
                        preregistrationGoodsId: preregistrationGoodsId,
                    },
                    success: function(data) {
                        var like = data.like + 1;
                        element.html("<span id='like-' + + preregistrationGoodsId"  + " class='glyphicon glyphicon-star' aria-hidden='true'></span>" + ' ' + like);
                    },
                    error: function() {
                    }
                });
            });
        }
    });
    window.router = new AppRouter();
    Backbone.history.start({pushState: false, hashChange: false});
});
