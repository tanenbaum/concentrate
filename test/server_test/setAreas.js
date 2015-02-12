/*jslint node: true */
'use strict';

var http = require('request-promise');

var helpers = require('./helpers');

var baseUrl = helpers.baseUrl;

var reject = helpers.reject;

exports.postAreaNameExists = function (test) {
    http.post({
            url: baseUrl + '/areas',
            json: {
                area: 'area1'
            }
        })
        .auth('test', 'test')
        .then(reject(test), function(err) {
            test.equal(400, err.statusCode);
            test.done();
        });
};

exports.postAreaInvalidJSON = function (test) {
    http.post({
            url: baseUrl + '/areas',
            json: {
                area: 'area3',
                config: 'potato'
            }
        })
        .auth('test', 'test')
        .then(reject(test), function(err) {
            test.equal(400, err.statusCode);
            test.done();
        });
};

exports.postArea3 = function (test) {
    http.post({
            url: baseUrl + '/areas',
            json: {
                area: 'area3',
                config: {
                    'a': 'b'
                },
                extend: ['area1', 'area2']
            }
        })
        .auth('test', 'test')
        .then(function(body) {
            test.deepEqual({
                'a': 'b',
                'foo': 'bar',
                'fizz': 'buzz'
            }, body);
            test.done();
        }, reject(test));
};

exports.putAreaNotExists = function (test) {
    http.put({
            url: baseUrl + '/areas/area51',
            json: {
                area: 'area51',
                config: {}
            }
        })
        .auth('test', 'test')
        .then(reject(test), function (err) {
            test.equal(404, err.statusCode);
            test.done();
        });
};

exports.putArea2 = function (test) {
    http.put({
            url: baseUrl + '/areas/area2',
            json: {
                area: 'area2',
                config: {},
                extend: 'area1'
            }
        })
        .auth('test', 'test')
        .then(function (body) {
            test.deepEqual({
                'foo': 'bar'
            }, body);
            test.done();
        }, reject(test));
};