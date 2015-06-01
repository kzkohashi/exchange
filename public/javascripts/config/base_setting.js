'use strict';

//configure
var configure = {
    _config : {},
    add: function(key, val){
        if(this._config[key]){
            throw new Error('Configure Error: The key [' + key + '] is already exists.');
        }
        this._config[key] = val;
    },
    mod: function(key, val){
        if(this._config[key] == undefined){
            throw new Error('Configure Error: The key [' + key + '] is not exists.');
        }
        this._config[key] = val;
    },
    get: function(key){
        return this._config[key];
    }
};

configure.add('requirejsSettings',
    {
        baseUrl: '/javascripts/lib',
        paths: {
            'backbone': 'backbone-min',
            'jquery': 'jquery.min',
            'underscore': 'underscore-min'
        },
        // moduleの依存関係
        shim: {
            'backbone': {
                deps: ['underscore', 'jquery'],
                exports: 'Backbone'
            }
        }
    }
);

if(typeof requirejs == 'object'){
    requirejs.config(configure.get('requirejsSettings'));
}

//for node.js
if(typeof exports != 'undefined'){
    module.exports = {
        configure: configure,
    }
}
