/*jslint node: true */
'use strict';

var _ = require('underscore');
var P = require('promise');
var parallel = P.denodeify(require('async').parallel);
var validate = require('jsonschema').validate;
var schema = require('./schema.json');

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
            var defaultConfig = defaults.config || {};
            var extend = defaults.extend;

            if (extend) {
                // array of things to extend...
                if (extend instanceof Array) {
                    if (extend.length) {
                        if (extend.length > 1) {
                            return parallel(
                                    _.map(extend, function (e) {
                                        return function (callback) { 
                                            return getArea(e).then(function (c) { callback(null, c); } , callback);
                                        };
                                    })).then(function (configs) {
                                        return _.reduce(
                                            configs, 
                                            function (memo, c) { return _.defaults(memo, c); }, 
                                            defaultConfig);
                                    });
                        }
                        else {
                            // just one element?
                            extend = extend[0];
                        }
                    }
                    else {
                        return defaultConfig;
                    }
                }

                // shortcut
                if (area === extend) {
                    return defaultConfig;
                }

                return getArea(extend).then(function (extendConfig) {
                    return _.defaults(defaultConfig, extendConfig);
                });
            }

            return defaultConfig;
        });
    };

    var setArea = function (area) {

        var validation = validate(area, schema);
        if (validation.errors.length) {
            return P.reject(validation.errors);
        }

        return configProvider.set(area).then(function () {
            return getArea(area.area);
        });

    };

    return {
        get: getArea,
        set: setArea,
        delete: function () {}
    };
};