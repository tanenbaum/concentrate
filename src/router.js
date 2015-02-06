/*jslint node: true */
'use strict';

var util = require('util');
var _ = require('underscore');

var errors = require('./errors');

var router = new require('express').Router();

var reject = function (res) {
    return function (err) {
        res.status(500);

        if (err.message) {
            return res.json(err.message);
        }

        res.json(err);
    };
};

router.route('/areas')
    // GET: list all area names
    .get(function (req, res) {
        req.provider.get().then(function (areas) {
            res.json(areas);
        }, reject(res));
    })
    // POST: create a new area, or replace an existing one
    .post(function (req, res) {
        var validName = req.provider.get().then(function (areas) {
            if (_.contains(areas, req.body.area)) {
                res.status(400).json({
                    message: util.format('Area with name %s already exists.', req.body.area)
                });
            }
        });

        validName.then(function () {
            req.provider.set(req.body).then(
                function (config) {
                    res.json(config);
                }, 
                function (err) {
                    if (err instanceof errors.InvalidJson) {
                        res.status(400).json({
                            message: err.message,
                            error: err.errors
                        });
                    }

                    reject(res)(err);
                });
            });
    });

router.route('/areas/:id') 
    // check id exists
    .all(function(req, res, next) {
        req.provider.get().then(function (areas) {
            if (_.contains(areas, req.params.id)) {
                return next();
            }

            res.status(404).json('Area does not exist');
        }, reject(res));
    })
    // GET: config for a specific area
    .get(function (req, res) {
        req.provider.get(req.params.id).then(function (config) {
            res.json(config);
        }, reject(res));
    })
    // PUT: update specific config elements
    .put(function (req, res) {
        req.provider.set(req.body).then(function (config) {
            res.json(config);
        }, reject(res));
    })
    // delete a config area
    .delete(function (req, res) {
        req.provider.remove(req.params.id).then(function () {
            res.status(200).end();
        }, reject(res));
    });

module.exports = router;