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
        baseUrl: '/',
        paths: {
            'backbone': 'javascripts/lib/backbone-min',
            'jquery': 'javascripts/lib/jquery.min',
            'jquery-masonry': 'javascripts/lib/jquery.masonry.min',
            'underscore': 'javascripts/lib/underscore-min',
            'bootstrap': 'bootstrap/js/bootstrap.min',
            'file-upload': 'javascripts/lib/file_upload',
            'auto-layout': 'javascripts/lib/auto_layout',
            'image-loaded': 'javascripts/lib/image_loaded'
        },
        // moduleの依存関係
        shim: {
            'backbone': {
                deps: ['underscore', 'jquery'],
                exports: 'backbone'
            },
            'bootstrap': {
                deps: ['jquery'],
                exports: 'bootstrap'
            },
            'jquery-masonry': {
                deps: ['jquery'],
                exports: 'jquery-masonry'
            },
            'image-loaded': {
                deps: ['jquery'],
                exports: 'image-loaded'
            },
            'file-upload': {
                deps: ['jquery'],
                exports: 'file-upload'
            },
            'auto-layout': {
                deps: ['jquery', 'image-loaded', 'jquery-masonry'],
                exports: 'auto-layout'
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
