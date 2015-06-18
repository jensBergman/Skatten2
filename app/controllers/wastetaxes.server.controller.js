'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Wastetax = mongoose.model('Wastetax'),
	_ = require('lodash');

/**
 * Create a Wastetax
 */
exports.create = function(req, res) {
	var wastetax = new Wastetax(req.body);
	wastetax.user = req.user;

	wastetax.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(wastetax);
		}
	});
};

/**
 * Show the current Wastetax
 */
exports.read = function(req, res) {
	res.jsonp(req.wastetax);
};

/**
 * Update a Wastetax
 */
exports.update = function(req, res) {
	var wastetax = req.wastetax ;

	wastetax = _.extend(wastetax , req.body);

	wastetax.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(wastetax);
		}
	});
};

/**
 * Delete an Wastetax
 */
exports.delete = function(req, res) {
	var wastetax = req.wastetax ;

	wastetax.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(wastetax);
		}
	});
};

/**
 * List of Wastetaxes
 */
exports.list = function(req, res) { 
	Wastetax.find().sort('-created').populate('user', 'displayName').exec(function(err, wastetaxes) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(wastetaxes);
		}
	});
};

/**
 * Wastetax middleware
 */
exports.wastetaxByID = function(req, res, next, id) { 
	Wastetax.findById(id).populate('user', 'displayName').exec(function(err, wastetax) {
		if (err) return next(err);
		if (! wastetax) return next(new Error('Failed to load Wastetax ' + id));
		req.wastetax = wastetax ;
		next();
	});
};

/**
 * Wastetax authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	/*if (req.wastetax.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}*/
		if (typeof req.user.roles[0] !== 'undefined' && req.user.roles[0] !== 'admin') {
		return res.status(403).send('User is not authorized, needs to have administration rights');
	}
	next();
};
