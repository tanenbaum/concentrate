/*jslint node: true */
'use strict';

var express = require('express');
var bodyParser = require('body-parser');

var basicAuth = require('basic-auth-connect');

// we're using json-local to load the config for the config loader...
var config = require('./config');

var app = express();

var env = process.env.NODE_ENV || 'development';

var settings = new config(
    { 
        module: './config_providers/json-local',
        source: __dirname + '/env.json'
    });

if (env === 'development') {
    app.use(basicAuth(function (user, pass) {
        return user === 'test' && pass === 'test';
    }));
}

app.use(bodyParser.json());

// .done forces exceptions to get thrown up to the host
settings.get(env).done(function (settings) {

    if (env !== 'development') {
        app.use(require(settings.auth));
    }

    // config provider middleware
    app.use(function (req, res, next) {
        try {
            req.provider = new config(settings.configProvider);
        } catch (err) {
            res.status(500).json(err);
        }
        next();
    });

    app.use(require(settings.routes));

    var server = app.listen(process.env.PORT || settings.port, function () {

        var host = server.address().address;
        var port = server.address().port;

        console.log('Config server listening at %s:%s', host, port);
    });

}, function(err) {
    console.log('Error in config server setup.');
    console.log(err);
});