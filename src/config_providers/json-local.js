/*jslint node: true */
'use strict';

var P = require('promise');

module.exports = function (options) {
    var source = options.source;

    return function (area) {
        return new P(function (resolve, reject) {
            var config;
            try {
                config = require(source);
            }
            catch (e) {
                return reject(e);
            }

            resolve(config[area]);
        });
    };
};