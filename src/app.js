/*jslint node: true */
'use strict';

var express = require('express');

var basicAuth = require('basic-auth-connect');

// we're using json-local to load the config for the config loader...
var config = require('./config');

var app = express();

var env = process.env.NODE_ENV || 'development';

var settings = config(
    { 
        module: './config_providers/json-local', 
        options: {
            source: '../env.json', // <- this is not ideal.
        }
    });

if (env === 'development') {
    app.use(basicAuth(function (user, pass) {
        return user === 'test' && pass === 'test';
    }));
}

settings(env).then(function (settings) {

    if (env !== 'development') {
        app.use(require(settings.auth));
    }

    app.route('/areas')
        .get(function (req, res) {
            res.send('areas get');
        })
        .post(function (req, res) {
            res.send('areas post');
        });

    app.route('/areas/:id')
        .get(function (req, res) {
            res.send('area get ' + req.params.id);
        })
        .put(function (req, res) {
            res.send('area put');
        })
        .delete(function (req, res) {
            res.send('area delete');
        });

    var server = app.listen(settings.port, function () {

        var host = server.address().address;
        var port = server.address().port;

        console.log('Config server listening at %s:%s', host, port);
    });

}, console.log);