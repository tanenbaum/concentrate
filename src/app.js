/*jslint node: true */
'use strict';

var express = require('express');

var app = express();

var env = app.get('env') || 'development';

var server = app.listen(3000, function () {

    var host = server.address().address;
    var port = server.address().port;

    console.log('Config server listening at %s:%s', host, port);
});