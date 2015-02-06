/*jslint node: true */
'use strict';

var P = require('promise');
var _ = require('underscore');
var readFile = P.denodeify(require('fs').readFile);
var writeFile = P.denodeify(require('fs').writeFile);
var errors = require('../errors');

// Read file and parse json async
var parseJson = function (source) {

    return readFile(source).then(function (raw) {
        try {
            return P.resolve(JSON.parse(raw));
        } catch (e) {
            if (e instanceof SyntaxError) {
                return P.reject('Syntax error in raw json file.');
            }
            return P.reject('Something bad happened when parsing json.');
        }
    });

};

module.exports = function (options) {
    var source = options.source;

    var get = function (area) {

        return parseJson(source).then(function (config) {
                if (area === undefined) {
                    return _.keys(config);
                }

                if (_.has(config, area))
                    return config[area];

                throw new errors.NotFound('Area not found.');
            });
    };

    var set = function (area) {
        
        return parseJson(source).then(function (config) {

            config[area.area] = _.omit(area, 'area');

            return writeFile(source, JSON.stringify(config)).then(function () {
                return config;
            });

        });

    };

    var remove = function (area) {

        return parseJson(source).then(function (config) {

            if (!_.has(config, area)) {
                throw new errors.NotFound('Area not found.');
            }

            var omit = _.omit(config, area);

            return writeFile(source, JSON.stringify(omit)).then(function () {
                return omit;
            });
        });

    };

    return {
        get: get,
        set: set,
        remove: remove
    };
};