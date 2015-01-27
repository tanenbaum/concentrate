/*jslint node: true */
'use strict';

var _ = require('underscore');
var P = require('promise');
var parallel = P.denodeify(require('async').parallel);
var validate = require('jsonschema').validate;
var schema = require('./schema.json');

var errors = require('./errors');

module.exports = function (settings) {
    var self = this;

    var configProvider = require(settings.module)(settings);

    // cache result of get all areas
    // TODO: this never gets cleared on area removal - is it necessary?
    var getAreas = _.once(function () {
        return configProvider.get();
    });

    // memoize result of getting individual area
    var getArea = _.memoize(function (area) {
        return configProvider.get(area);
    });

    self.get = _.memoize(function (area) {

        // area is undefined, get area names
        if (area === undefined) {
            return getAreas().then(function (areas) {
                return areas;
            });
        }

        // area is specified, get config
        return getArea(area).then(function (config) {

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
                                            return self.get(e).then(function (c) { callback(null, c); } , callback);
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

                return self.get(extend).then(function (extendConfig) {
                    return _.defaults(defaultConfig, extendConfig);
                });
            }

            return defaultConfig;
        });
    });

    var clearCache = function () {
        getArea.cache = {};
        self.get.cache = {};
    };

    self.set = function (area) {

        var validation = validate(area, schema);
        if (validation.errors && validation.errors.length) {
            return P.reject(new errors.InvalidJson(validation.errors));
        }

        return configProvider.set(area).then(function () {
            // empty the cache
            clearCache();
            return self.get(area.area);
        });

    };

    self.remove = function (area) {

        return configProvider.remove(area).then(function () {
            // empty the cache
            clearCache();
        });

    };
};