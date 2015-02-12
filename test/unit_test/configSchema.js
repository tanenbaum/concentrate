/*jslint node: true */
'use strict';

var validate = require('jsonschema').validate;
var schema = require('../../src/schema.json');

function validObject(o) {
    return !validate(o, schema).errors.length;
}

exports.validateSchema = function(test) {

    test.ok(validObject({
        area: 'foo',
        config: {}
    }), 'Valid schema, with area.');

    test.ok(validObject({
        area: 'foo',
        config: {
            a: 1,
            b: [1, 2, 3]
        }
    }), 'Valid schema, with complex config.');

    test.ok(!validObject({
        config: {}
    }), 'Invalid schema, no area specified.');

    test.ok(!validObject({
        area: 5,
        config: 'foo',
        extend: 'x'
    }), 'Invalid schema, bad data types.');

    test.done();
};

exports.extendsAllowsArraysOfStrings = function(test) {
        test.ok(validObject({
            area: 'foo',
            extend: 'x'
        }), 'Valid schema, extend is string.');

        test.ok(validObject({
            area: 'foo',
            extend: ['x', 'y']
        }), 'Valid schema, extend is array of strings');

        test.ok(!validObject({
            area: 'foo',
            extend: [ 'x', 1 ]
        }), 'Invalid schema, extend is mixed array.');

        test.ok(!validObject({
            area: 'foo',
            extend: 5
        }), 'Invalid schema, extend is a number');

    test.done();
};