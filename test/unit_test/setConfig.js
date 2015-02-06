/*jslint node: true */
'use strict';

var fs = require('fs');
var _ = require('underscore');
var config = require('../../src/config');

var localJson = new config(
        {
            module: './config_providers/json-local',
            source: './test/unit_test/setConfig.json'
        });

module.exports = {

    setUp: function (callback) {
        // initialise test config file
        fs.writeFile('./test/unit_test/setConfig.json', JSON.stringify({
            'a': {
                'config': {
                    'a': 1,
                    'b': [1, 2, 3, 4]
                }
            }
        }), callback);
    },

    setNewConfigUndefined: function (test) {
        localJson.set().then(function() {}, function (err) { test.ok(err); test.done(); });
    },

    setNewConfigEmpty: function (test) {
        localJson.set({}).then(function () {}, function (err) { test.ok(err); test.done(); });
    },

    setNewConfig: function (test) {
        localJson.set({
            'area': 'b',
            'extend': 'a'
        }).then(
            function (config) {
                localJson.get('b').then(function (actual) {
                    console.log(config);
                    console.log(actual);
                    test.deepEqual(actual, config);
                    test.done();
                });
            }, 
            function (err) { 
                console.log(err); 
                test.ok(false); 
                test.done(); 
            }
        );
    },

    overriteExistingConfig: function (test) {
        localJson.set({
            'area': 'a', 
            'config': {
                'c': 'potato'
            }
        }).then(
            function (config) {
                localJson.get('a').then(function (actual) {
                    console.log(config);
                    console.log(actual);
                    test.deepEqual(actual, config);
                    test.done();
                });
            },
            function (err) {
                console.log(err);
                test.ok(false);
                test.done();
            }
        );
    },

    deleteExistingConfig: function (test) {
        localJson.remove('a').then(
            function (config) {
                localJson.get().then(function (keys) {
                    test.ok(!_.contains(keys, 'a'));
                    test.ok(!_.has(config, 'a'));
                    test.done();
                });
            },
            function (err) {
                console.log(err);
                test.ok(false);
                test.done();
            }
        );
    },

    makeSureCacheClears: function (test) {
        var areaA = {
            'area': 'a',
            'config': {
                'a': 1,
                'b': [1, 2, 3, 4]
            },
            'extend': 'b'
        };

        var areaB = {
            'area': 'b',
            'config': {
                'array': [1, 2, 3, 4]
            }
        };

        localJson.set(areaB).then(function () {
                localJson.set(areaA).then(function (a) {
                    test.deepEqual(a, _.extend(areaA.config, areaB.config));
                    test.done();
                });
            });
    }
};