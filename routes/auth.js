/*
 * auth page.
 */

// third party
var config = require('config');

//dao
var userDao = require('models/dao/user_dao');

// var helper    = requestuire('helpers/applicationHelper');
// var mailer    = requestuire('mailer/applicationMailer');

// error handler
var errorHandler = require('errors/error');

//OAuth認証のためのpassportモジュール読み込み
var passport = require('passport');
var FacebookStrategy = require('passport-facebook-canvas');
var TwitterStrategy = require('passport-twitter').Strategy;

exports.init = function(router) {

    router.get('/auth', function(request, response) {
        response.render('auth');
    });

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

    // /authにアクセスする事で、facebook認証につながる。
    router.get('/auth/facebook', passport.authenticate('facebook-canvas', { scope: ['email'] } ));

    //　facebook認証が終わると、このoauthloginにget通信がされる。
    router.get('/auth/facebook/callback', passport.authenticate('facebook-canvas', {failureRedirect: '/login?fail'}),
        function(request, response) {
            userDao.getByFacebookId(request.user.id, function(error, result) {
                if(error) {
                    errorHandler.invalidrequestuest(response, error);
                    return;
                }
                // ログアウトしていた場合
                if (result && result.deleteFlag === false) {
                    request.session.userId = result.id;
                    request.session.accessToken = passport.session.accessToken;
                    response.redirect('/');
                // アカウント削除していた場合
                } else if (result && result.deleteFlag) {
                    userDao.updateByUserId(result.userId, {deleteFlag: false}, function(error) {
                        if (error) {
                            errorHandler.invalidrequestuest(response, error);
                            return;
                        }
                        request.session.userId = result.id;
                        response.redirect('/');
                    });
                // 新規アカウント作成
                } else {
                    var user = request.user;
                    var data = {
                        facebookId: user.id,
                        username: user.displayName,
                        gender: user.gender,
                        email: user.emails[0].value,
                        imagePath: 'https://graph.facebook.com/' + user.id + '/picture'
                    }
                    userDao.add(data, function(error, data) {
                        if(error) {
                            errorHandler.invalidrequestuest(response, error);
                            return;
                        }
                        request.session.userId = data.id;

                        if(data.email){
                            // 登録完了メール送信
                            // mailer.sendWellcome(data.email, user.displayName);
                        }
                        response.redirect('/');
                    });
                }
            });
        }
    );

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
