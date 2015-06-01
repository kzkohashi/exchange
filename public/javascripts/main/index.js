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
            var hostUserId;
            var userGoodsId;
            $(document).on('click', '.btn-exchange', function(){
                var $el = $(this);
                userGoodsId = $el.data('user-goods-id');
                hostUserId = $el.data('host-user-id');
            });
            $('.btn-exchange-request').click(function() {
                var $el = $(this);
                var exchangeUserGoodsId = $el.data('exchange-user-goods-id');
                $.ajax({
                    type: 'GET',
                    url: '/exchange/request',
                    data: {
                        // _csrf: $('meta[name=csrf-token]').attr('content'),
                        hostUserId: hostUserId,
                        userGoodsId: userGoodsId,
                        exchangeUserGoodsId: exchangeUserGoodsId
                    },
                    success: function(data) {
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
