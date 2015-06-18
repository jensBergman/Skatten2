'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Party = mongoose.model('Party'),
	_ = require('lodash');

/**
 * Create a Party
 */
exports.create = function(req, res) {
	var party = new Party(req.body);
	party.user = req.user;

	party.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(party);
		}
	});
};

/**
 * Show the current Party
 */
exports.read = function(req, res) {
	res.jsonp(req.party);
};

/**
 * Update a Party
 */
exports.update = function(req, res) {
	var party = req.party ;

	party = _.extend(party , req.body);

	party.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(party);
		}
	});
};

/**
 * Delete an Party
 */
exports.delete = function(req, res) {
	var party = req.party ;

	party.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(party);
		}
	});
};

/**
 * List of Parties
 */
exports.list = function(req, res) { 
	Party.find().sort('-created').populate('user', 'displayName').exec(function(err, parties) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(parties);
		}
	});
};

/**
 * Party middleware
 */
exports.partyByID = function(req, res, next, id) { 
	Party.findById(id).populate('user', 'displayName').exec(function(err, party) {
		if (err) return next(err);
		if (! party) return next(new Error('Failed to load Party ' + id));
		req.party = party ;
		next();
	});
};

/**
 * Party authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	/*if (req.party.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}*/
		if (typeof req.user.roles[0] !== 'undefined' && req.user.roles[0] !== 'admin') {
		return res.status(403).send('User is not authorized, needs to have administration rights');
	}
	next();
};
