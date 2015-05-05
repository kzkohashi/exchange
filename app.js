/**
 *  path setting
 */
process.env['NODE_PATH'] = __dirname + '/lib:'  + __dirname + '/node_modules:' + __dirname + '/resources';
require('module')._initPaths();

/**
 *  dependencies
 */
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var RedisStore = require('connect-redis')(session);
var ECT = require('ect');
var fs = require('fs');
var _ = require('underscore');

var app = express();
var router = express.Router();
app.use(router);

// view engine setup
var ectRenderer = ECT({
    watch: true,
    root: __dirname + '/views',
    ext: '.ect'
});
app.engine('ect', ectRenderer.render);
app.set('view engine', 'ect');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// session
app.use(session({
    store: new RedisStore({
        host: '127.0.0.1',
        port: 6379
    }),
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true }
}));

// router setting
 var routesFileNameList = fs.readdirSync(path.join(__dirname, 'routes'));
_.each(routesFileNameList, function(routesFileName) {
    var routesFileName = routesFileName.replace('.js', '');
    require('./routes/' + routesFileName).init(router);
});

//set helpers to global object
_.each([__dirname + '/lib/views/helpers/', __dirname + '/views/helpers/'], function(path) {
    if (fs.existsSync(path)) {
        fs.readdirSync(path).forEach(function(file) {
            var helper = require(path + file);
            _.each(helper, function(obj, key) {
                app.locals[key] = obj;
            });
        });
    }
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
