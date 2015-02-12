/*jslint node: true */
'use strict';

var config = require('./config.json');

exports.baseUrl = 'http://localhost:' + config.port;

exports.reject = function (test) {
    return function (err) {
        test.ok(false, err);
        test.done();
    };
};