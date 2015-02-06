/*jslint node: true */
'use strict';

var http = require('request-promise');

var config = require('./config.json');

var baseUrl = 'http://localhost:' + config.port;

var reject = function (test) {
    return function (err) {
        test.ok(false, err);
        test.done();
    };
};

exports.getAreaNames = function (test) {
    http.get(baseUrl + '/areas')
        .auth('test', 'test')
        .then(function (body) {
            test.deepEqual(['area1', 'area2'], JSON.parse(body));
            test.done();
        }, reject(test));
};

exports.getArea1 = function (test) {
    http.get(baseUrl + '/areas/area1')
        .auth('test', 'test')
        .then(function(body) {
            test.deepEqual({
                'foo': 'bar'
            }, JSON.parse(body));
            test.done();
        }, reject(test));
};

exports.getArea404 = function (test) {
    http.get(baseUrl + '/areas/potato')
        .auth('test', 'test')
        .then(reject, function (err) {
            test.equal(404, err.statusCode);
            test.done();
        });
};