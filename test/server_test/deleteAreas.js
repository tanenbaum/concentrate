/*jslint node: true */
'use strict';

var _ = require('underscore');

var http = require('request-promise');

var helpers = require('./helpers');

var baseUrl = helpers.baseUrl;

var reject = helpers.reject;

exports.deleteAreaNotExists = function (test) {
    http.del(baseUrl + '/areas/potato')
        .auth('test', 'test')
        .then(reject(test), function(err) {
            test.equal(404, err.statusCode);
            test.done();
        });
};

exports.deleteArea = function (test) {
    http.del(baseUrl + '/areas/safeDelete')
        .auth('test', 'test')
        .then(function () {
            http.get(baseUrl + '/areas')
                .auth('test', 'test')
                .then(function (areas) {
                    test.ok(!_.contains(areas, 'safeDelete'));
                    test.done();
                });
        }, reject(test));
};