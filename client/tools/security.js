const express = require('express');

const path = require('path');


const passport = require('passport');
const http = require('http');

const OAuth2Strategy = require('passport-oauth').OAuth2Strategy;



/* eslint-disable no-console */

const port = 8051;
const app = express();
app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (id, done) {

    done(null, { username: 'Filip' });

});


passport.use('provider', new OAuth2Strategy({
    authorizationURL: 'http://localhost:3000/dialog/authorize',
    tokenURL: 'http://localhost:3000/oauth/token',
    clientID: 'food-app',
    clientSecret: 'mysecret',
    callbackURL: 'http://localhost:8050/callback'
},
    function (accessToken, refreshToken,profile, done) {
        http.get({
            hostname: 'localhost',
            port: 3000,
            path: '/api/user',
            agent: false,  // create a new agent just for this one request,
            headers: {
                'Authorization': 'Bearer ' + accessToken

            }
        }, (res) => {

            let buf = '';
            res.on("data", function (chunk) {
                console.log(buf += chunk);
            });
            res.on("end", function (chunk) {
            let user = JSON.parse(buf);
                console.log(user);
                done(null, user);
            });

        });


    }
));





app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, '../index.html'));
});
app.get('/auth/provider', passport.authenticate('provider'));
app.get('/callback', passport.authenticate('provider', {
    successRedirect: 'http://localhost:8050/',
    failureRedirect: 'http://localhost:3000/login'
}));

app.listen(port, function (err) {
    if (err) {
        console.log(err);
    }
});
