'use strict';

/**
 * Module dependencies.
 */
 var mongoose = require('mongoose'),
 errorHandler = require('./errors.server.controller'),
 Politician = mongoose.model('Politician'),
 _ = require('lodash');

/**
 * Create a Politician
 */
 exports.create = function(req, res) {
 	var politician = new Politician(req.body);
 	politician.user = req.user;

 	politician.save(function(err) {
 		if (err) {
 			return res.status(400).send({
 				message: errorHandler.getErrorMessage(err)
 			});
 		} else {
 			res.jsonp(politician);
 		}
 	});
 };

/**
 * Show the current Politician
 */
 exports.read = function(req, res) {
 	res.jsonp(req.politician);
 };

/**
 * Update a Politician
 */
 exports.update = function(req, res) {
 	var politician = req.politician ;

 	politician = _.extend(politician , req.body);

 	politician.save(function(err) {
 		if (err) {
 			return res.status(400).send({
 				message: errorHandler.getErrorMessage(err)
 			});
 		} else {
 			res.jsonp(politician);
 		}
 	});
 };

/**
 * Delete an Politician
 */
 exports.delete = function(req, res) {
 	var politician = req.politician ;

 	politician.remove(function(err) {
 		if (err) {
 			return res.status(400).send({
 				message: errorHandler.getErrorMessage(err)
 			});
 		} else {
 			res.jsonp(politician);
 		}
 	});
 };

/**
 * List of Politicians
 */
 exports.list = function(req, res) { 
 	Politician.find().sort('-created').populate('user', 'displayName').exec(function(err, politicians) {
 		if (err) {
 			return res.status(400).send({
 				message: errorHandler.getErrorMessage(err)
 			});
 		} else {
 			res.jsonp(politicians);
 		}
 	});
 };

/**
 * Politician middleware
 */
 exports.politicianByID = function(req, res, next, id) { 
 	Politician.findById(id).populate('user', 'displayName').exec(function(err, politician) {
 		if (err) return next(err);
 		if (! politician) return next(new Error('Failed to load Politician ' + id));
 		req.politician = politician ;
 		next();
 	});
 };

/**
 * Politician authorization middleware
 */
 exports.hasAuthorization = function(req, res, next) {
	/*if (req.politician.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}*/
	/*if (!req.user.isAdmin) {
		return res.status(403).send('User is not authorized, login as admin');
	}*/

	if (req.user.roles[0] !== 'admin') {
		return res.status(403).send('User is not authorized, needs to have administration rights');
	}
	next();
};
