/*jslint node: true */
'use strict';

var _ = require('underscore');

function NotFound (message) {
    this.name = "Not Found";
    this.message = message;
}

NotFound.prototype = new Error();
NotFound.prototype.constructor = NotFound;

function InvalidJson (errors) {
    this.name = "Json invalid";
    this.message = _.reduce(errors, function (memo, err) {
        return memo + '\n' + err.stack;
    }, '');

    this.errors = errors;
}

InvalidJson.prototype = new Error();
InvalidJson.prototype.constructor = InvalidJson;

exports.NotFound = NotFound;

exports.InvalidJson = InvalidJson;