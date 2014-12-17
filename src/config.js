/*jslint node: true */
'use strict';

var _ = require('underscore');
var P = require('Promise');
var async = require('async');

module.exports = function (settings) {
    var configLoader = require(settings.module)(settings);

    var loadConfig = function (area) {

        return new P(function (resolve, reject) { 
            configLoader(area).then(function (config) {          

                var defaults = _.clone(config);
                var extend = defaults.extend;

                if (extend) {
                    // array of things to extend...
                    if (extend instanceof Array) {
                        if (extend.length) {
                            if (extend.length > 1) {
                                return async.parallel(
                                    _.map(extend, function (e) {
                                        return function (callback) { 
                                            return loadConfig(e).then(function (c) { callback(null, c); } , callback);
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
                            }
                            else {
                                // just one element?
                                extend = extend[0];
                            }
                        }
                        else {
                            return resolve(defaults.config);
                        }
                    }

                    // shortcut
                    if (area === extend) {
                        return resolve(defaults.config);
                    }

                    return loadConfig(extend).then(function (extendConfig) {
                        resolve(_.defaults(defaults.config, extendConfig));
                    }, reject);
                }

                resolve(defaults.config);
            }, reject);
        });
    };

    return loadConfig;
};