/*jslint node: true */
'use strict';

var P = require('promise');

var _ = require('underscore');

module.exports = function (options) {
    var source = options.source;

    var loadConfig = function (area) {

        return new P(function (resolve, reject) {

            var config;
            try {
                config = require(source);
            }
            catch (e) {
                return reject(e);
            }

            var defaults = _.clone(config[area] || config);
            var extend = defaults.extend;

            if (area && extend) {
                // shortcut
                if (area === extend) {
                    return resolve(defaults.config);
                }

                return resolve(_.defaults(defaults, loadConfig(extend)));
            }

            if (area) {
                return resolve(defaults.config);
            }

            return resolve(defaults);
        });

        
    };

    return loadConfig;
};