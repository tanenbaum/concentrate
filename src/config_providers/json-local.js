/*jslint node: true */
'use strict';

var P = require('promise');
var _ = require('underscore');

module.exports = function (options) {
    var source = options.source;

    var get = function (area) {
        return new P(function (resolve, reject) {
            var config;
            try {
                config = require(source);
            }
            catch (e) {
                return reject(e);
            }

            if (area === undefined) {
                resolve(_.keys(config));
            }

            resolve(config[area]);
        });
    };

    return {
        get: get
    };
};