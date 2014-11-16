/*jslint node: true */
'use strict';

var _ = require('underscore');

function loadConfig (source, defaultArea) {
    var config = require(source);

    var defaults = _.clone(config[defaultArea]) || config;

    return function (area) {

        if (area && defaultArea) {
            // shortcut
            if (area === defaultArea) {
                return defaults;
            }

            return _.defaults(_.clone(config[area]), defaults);
        }

        if (area) {
            return _.clone(config[area]);
        }

        return defaults;
    };
}

module.exports = loadConfig;