/*
 * auth page.
 */

// third party
var config = require('config');
var async = require('async');

//dao
var userDao = require('models/dao/user_dao');

// error handler
var errorHandler = require('errors/error');

//OAuth認証のためのpassportモジュール読み込み
var passport = require('passport');
var FacebookStrategy = require('passport-facebook-canvas');
var TwitterStrategy = require('passport-twitter').Strategy;

//OAuth認証用
passport.use(new FacebookStrategy({
    clientID: config.get('facebook.appId'),
    clientSecret: config.get('facebook.appSecret'),
    callbackURL: config.get('facebook.callbackUrl'),
}, function(accessToken, refresponsehToken, profile, callback){
    passport.session.accessToken = accessToken;
    process.nextTick(function(){
        callback(null, profile);
    });
}));

passport.serializeUser(function(user, callback){
    callback(null, user);
});

passport.deserializeUser(function(obj, callback){
    callback(null, obj);
});

exports.init = function(router) {

    router.get('/auth', function(request, response) {
        response.render('auth');
    });

    // /authにアクセスする事で、facebook認証につながる。
    router.get('/auth/facebook', passport.authenticate('facebook-canvas', { scope: ['email'] } ));

    //　facebook認証が終わると、このoauthloginにget通信がされる。
    router.get('/auth/facebook/callback', passport.authenticate('facebook-canvas', {failureRedirect: '/auth'}), function(request, response) {
        async.waterfall([
            function(callback) {
                userDao.getByFacebookId(request.user.id, callback);
            },
            function(result, callback) {
                // ログアウトしていた場合
                if (result && result.deleteFlag === false) {
                    callback(null, result.id);
                    return;
                }

                // アカウント削除していた場合
                if (result && result.deleteFlag) {
                    userDao.updateByUserId({
                        id: result.id,
                        uodateParameter: {
                            deleteFlag: false
                        }
                    }, function(error) {
                        if (error) {
                            callback(error);
                            return;
                        }
                        callback(null, result.id);
                    });
                    return;
                }

                var user = request.user;
                userDao.add({
                    facebookId: user.id,
                    username: user.displayName,
                    gender: user.gender,
                    email: user.emails[0].value,
                    imagePath: 'https://graph.facebook.com/' + user.id + '/picture'
                }, function(error, data) {
                    if(error) {
                        callback(error);
                        return;
                    }
                    callback(null, data.id);
                });
            }
        ], function(error, userId) {
            if (error) {
                errorHandler.invalidRequest(response, error);
                return;
            }
            request.session.userId = userId;
            response.redirect('/');
        });
    });

    // passport.use(new TwitterStrategy({
    //         consumerKey: app.get('config').twitter.consumer_key,
    //         consumerSecret: app.get('config').twitter.consumer_secret,
    //         callbackURL: app.get('config').twitter.callback_url
    //     }, function(token, tokenSecret, profile, callback) {
    //         process.nextTick(function(){
    //             callback(null, profile);
    //         });
    //     }
    // ));

    // router.get('/auth/twitter', passport.authenticate('twitter'));

    // router.get('/auth/twitter/callback', passport.authenticate('twitter', {failureRedirect: '/login?fail'}),
    //     function(request, response) {
    //         userDao.getByTwitterId(request.user.id, function(err, responseult) {
    //             if(err) {
    //                 helper.responseponseError(response, err, 500);
    //                 return;
    //             }
    //             if(responseult) {
    //                 request.session.userId = responseult.userId;
    //                 response.redirect('/');
    //             } else {
    //                 var data = {
    //                     twitterId: request.user.id,
    //                     username:    request.user.username,
    //                     imagePath: request.user.photos[0].value.replace('image_normal.jpg', 'image.jpg') //todo とりあえず置換！
    //                 }
    //                 userDao.addUser(data, function(err, responseult) {
    //                     if(err) {
    //                         helper.responseponseError(response, err, 500);
    //                         return;
    //                     }
    //                     request.session.userId = responseult.userId;
    //                     response.redirect('/');
    //                 });
    //             }
    //         });
    //     }
    // );
};
