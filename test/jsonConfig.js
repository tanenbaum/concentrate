/*jslint node: true */
'use strict';

var _ = require('underscore');

var localJson = require('../src/config_providers/json-local')(
        {
            source: '../../test/config.json'
        });

var localConfig = require('./config.json');

function testConfigEquals(test, config, local, area) {
    config(area).then(function (settings) {
        test.ok(_.isEqual(local, settings));
        test.done();
    });
}

exports.localConfigNoExtend = function (test) {
    testConfigEquals(test, localJson, localConfig.s1.config, 's1');
};

exports.localConfigExtend = function (test) {
    testConfigEquals(test, localJson, _.defaults(localConfig.s1.config, localConfig.s2.config), 's2');
};

exports.localConfigExtend2 = function (test) {
    testConfigEquals(test, localJson, 
        _.chain(localConfig.s1.config).defaults(localConfig.s2.config).defaults(localConfig.s3.config).value(), 
        's3');
};