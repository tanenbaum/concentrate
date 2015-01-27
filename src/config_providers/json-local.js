/*jslint node: true */
'use strict';

var P = require('promise');
var _ = require('underscore');
var readFile = P.denodeify(require('fs').readFile);
var writeFile = P.denodeify(require('fs').writeFile);
var errors = require('../errors');

module.exports = function (options) {
    var source = options.source;

    var get = function (area) {

        return readFile(source).then(function (raw) {

            var config = JSON.parse(raw);

            if (area === undefined) {
                return _.keys(config);
            }

            if (_.has(config, area))
                return config[area];

            throw new errors.NotFound('Area not found.');
        });

    };

    var set = function (area) {
        
        return readFile(source).then(function (raw) {

            var config = JSON.parse(raw);

            config[area.area] = _.omit(area, 'area');

            return writeFile(source, JSON.stringify(config)).then(function () {
                return config;
            });

        });

    };

    var remove = function (area) {

        return readFile(source).then(function (raw) {

            var config = JSON.parse(raw);

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