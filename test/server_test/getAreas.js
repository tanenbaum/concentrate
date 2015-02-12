/*jslint node: true */
'use strict';

var _ = require('underscore');

var http = require('request-promise');

var helpers = require('./helpers');

var baseUrl = helpers.baseUrl;

var reject = helpers.reject;

exports.getAreaNames = function (test) {
    http.get(baseUrl + '/areas')
        .auth('test', 'test')
        .then(function (body) {
            var areas = JSON.parse(body);
            test.ok(_.contains(areas, 'area1'));
            test.ok(_.contains(areas, 'area2'));
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
        .then(reject(test), function (err) {
            test.equal(404, err.statusCode);
            test.done();
        });
};