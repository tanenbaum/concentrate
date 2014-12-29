/*jslint node: true */
'use strict';

var _ = require('underscore');
var async = require('async');
var P = require('promise');

module.exports = function (settings) {
    var configProvider = require(settings.module)(settings);

    var getArea = function (area) {

        // area is undefined, get area names
        if (area === undefined) {
            return configProvider.get().then(function (areas) {
                return areas;
            });
        }

        // area is specified, get config
        return configProvider.get(area).then(function (config) {          

            var defaults = _.clone(config);
            var extend = defaults.extend;

            if (extend) {
                // array of things to extend...
                if (extend instanceof Array) {
                    if (extend.length) {
                        if (extend.length > 1) {
                            return new P(function (resolve, reject) {
                                return async.parallel(
                                    _.map(extend, function (e) {
                                        return function (callback) { 
                                            return getArea(e).then(function (c) { callback(null, c); } , callback);
                                        };
                                    }),
                                    function (err, configs) {
                                        if (err) {
                                            reject(err);
                                        }
                                        resolve(_.reduce(
                                            configs, 
                                            function (memo, c) { return _.defaults(memo, c); }, 
                                            defaults.config));
                                    });
                            });
                        }
                        else {
                            // just one element?
                            extend = extend[0];
                        }
                    }
                    else {
                        return defaults.config;
                    }
                }

                // shortcut
                if (area === extend) {
                    return defaults.config;
                }

                return getArea(extend).then(function (extendConfig) {
                    return _.defaults(defaults.config, extendConfig);
                });
            }

            return defaults.config;
        });
    };

    return {
        get: getArea,
        set: function () {},
        delete: function () {}
    };
};