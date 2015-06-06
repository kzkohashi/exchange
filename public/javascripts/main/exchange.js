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
            $('.btn-exchange-request-cancel').click(function() {
                var $el = $(this);
                var userExchangeGoodsSequenceId = $el.data('user-exchange-goods-sequence-id');
                var removeGoods = document.getElementById(userExchangeGoodsSequenceId);
                $.ajax({
                    type: 'GET',
                    url: '/exchange/request_cancel',
                    data: {
                        userExchangeGoodsSequenceId: userExchangeGoodsSequenceId
                    },
                    success: function(data) {
                        if (data.result === true) {
                            removeGoods.remove();
                        }
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
