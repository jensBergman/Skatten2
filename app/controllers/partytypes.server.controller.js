'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Partytype = mongoose.model('Partytype'),
	_ = require('lodash');

/**
 * Create a Partytype
 */
exports.create = function(req, res) {
	var partytype = new Partytype(req.body);
	partytype.user = req.user;

	partytype.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(partytype);
		}
	});
};

/**
 * Show the current Partytype
 */
exports.read = function(req, res) {
	res.jsonp(req.partytype);
};

/**
 * Update a Partytype
 */
exports.update = function(req, res) {
	var partytype = req.partytype ;

	partytype = _.extend(partytype , req.body);

	partytype.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(partytype);
		}
	});
};

/**
 * Delete an Partytype
 */
exports.delete = function(req, res) {
	var partytype = req.partytype ;

	partytype.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(partytype);
		}
	});
};

/**
 * List of Partytypes
 */
exports.list = function(req, res) { 
	Partytype.find().sort('-created').populate('user', 'displayName').exec(function(err, partytypes) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(partytypes);
		}
	});
};

/**
 * Partytype middleware
 */
exports.partytypeByID = function(req, res, next, id) { 
	Partytype.findById(id).populate('user', 'displayName').exec(function(err, partytype) {
		if (err) return next(err);
		if (! partytype) return next(new Error('Failed to load Partytype ' + id));
		req.partytype = partytype ;
		next();
	});
};

/**
 * Partytype authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	/*if (req.partytype.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized, please login with account: ' + req.partytype.user.username);
	}*/
	/*if (req.user.isAdmin !== true) {
		return res.status(403).send('User is not authorized, needs to have administration rights');
	}*/
	if (req.user.roles[0] !== 'admin') {
		return res.status(403).send('User is not authorized, needs to have administration rights');
	}
	next();
};
