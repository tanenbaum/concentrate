/*jslint node: true */
'use strict';

var _ = require('underscore');

var localJson = require('../src/config')(
        {
            module: './config_providers/json-local',
            source: '../../test/config.json'
        });

var localConfig = require('./config.json');

function testConfigEquals(test, config, local, area) {
    config(area).then(function (settings) {
        console.log(local);
        console.log(settings);
        test.ok(_.isEqual(local, settings));
        test.done();
    });
}

exports.localConfigNoExtend = function (test) {
    testConfigEquals(test, localJson, localConfig.s1.config, 's1');
};

exports.localConfigExtend = function (test) {
    testConfigEquals(test, localJson, _.defaults(localConfig.s2.config, localConfig.s1.config), 's2');
};

exports.localConfigExtend2 = function (test) {
    testConfigEquals(test, localJson, 
        _.chain(localConfig.s3.config).defaults(localConfig.s2.config).defaults(localConfig.s1.config).value(), 
        's3');
};

exports.localConfigExtendMany = function (test) {
    testConfigEquals(test, localJson, 
        _.reduce([localConfig.s1.config, localConfig.s2.config, localConfig.s3.config], 
            function (m, c) { return _.defaults(m, c); }, _.clone(localConfig.s4.config)), 
        's4');
};

exports.localConfigExtendOne = function (test) {
    testConfigEquals(test, localJson, localConfig.s1.config, 's5');
};

exports.localConfigExtendEmpty = function (test) {
    testConfigEquals(test, localJson, {}, 's6');
};