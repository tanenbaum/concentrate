/*jslint node: true */
'use strict';

var P = require('promise');
var _ = require('underscore');
var readFile = P.denodeify(require('fs').readFile);
var writeFile = P.denodeify(require('fs').writeFile);

module.exports = function (options) {
    var source = options.source;

    var get = function (area) {

        return readFile(source).then(function (raw) {

            var config = JSON.parse(raw);

            if (area === undefined) {
                return _.keys(config);
            }

            return config[area];
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

    return {
        get: get,
        set: set
    };
};