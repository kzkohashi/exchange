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
var MongoStore = require('connect-mongo')(session); //sessionストア用のDB
var ECT = require('ect');
var fs = require('fs');
var _ = require('underscore');
var config = require('config');
var passport = require('passport');
var multer  = require('multer')
var expressValidator  = require('express-validator')

// create application
var app = express();

// create router
var router = express.Router();

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
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(multer());
app.use(expressValidator());

// Attached some objects and vars to request object.
app.use(function(request, response, callback) {
    request.currentDatetime = new Date();
    callback();
});

// session
app.use(session({
    store: new MongoStore({
        url: 'mongodb://localhost',
        db: 'exchange_session_user'
    }),
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 7 * 24 * 60 * 60 * 1000, // a week
        secure: true,
        httpOnly : true,
        path : '/'
    }
}));

// filter setting
app.use(
    require('middlewares/express_filter')
    .onError(function(error, req, res){
        require('routes/error').index(req, res, error);
    })
    .setRoot(__dirname)
    .config(__dirname + '/config/filter_config.json')
    .doFilter(app)
);

//OAuth認証用
app.use(passport.initialize());
app.use(passport.session());

// router setting
 var routesFileNameList = fs.readdirSync(path.join(__dirname, 'routes'));
_.each(routesFileNameList, function(routesFileName) {
    var routesFileName = routesFileName.replace('.js', '');
    require(__dirname + '/routes/' + routesFileName).init(router);
});
app.use(router);

// handling multipart/form-data
app.use(multer());

//set helpers to app.locals
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

// set config to app.locals
app.locals.title = config.get('app.title');
app.locals.facebook = config.get('facebook');

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
