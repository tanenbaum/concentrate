/*jslint node: true */
'use strict';

var fs = require('fs');

var localJson = require('../src/config')(
        {
            module: './config_providers/json-local',
            source: './test/setConfig.json'
        });

module.exports = {

    setUp: function (callback) {
        // initialise test config file
        fs.writeFile('./test/setConfig.json', JSON.stringify({
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
    }
};