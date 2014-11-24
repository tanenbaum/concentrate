/*jslint node: true */
'use strict';

module.exports = function (settings) {
    var configLoader = require(settings.module)(settings.options);

    return configLoader;
};