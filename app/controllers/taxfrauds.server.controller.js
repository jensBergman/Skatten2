'use strict';

/**
 * Module dependencies.
 */
 var mongoose = require('mongoose'),
 errorHandler = require('./errors.server.controller'),
 Taxfraud = mongoose.model('Taxfraud'),
 _ = require('lodash');

/**
 * Create a Taxfraud
 */
 exports.create = function(req, res) {
 	var taxfraud = new Taxfraud(req.body);
 	taxfraud.user = req.user;

 	taxfraud.save(function(err) {
 		if (err) {
 			return res.status(400).send({
 				message: errorHandler.getErrorMessage(err)
 			});
 		} else {
 			res.jsonp(taxfraud);
 		}
 	});
 };

/**
 * Show the current Taxfraud
 */
 exports.read = function(req, res) {
 	res.jsonp(req.taxfraud);
 };

/**
 * Update a Taxfraud
 */
 exports.update = function(req, res) {
 	var taxfraud = req.taxfraud ;

 	taxfraud = _.extend(taxfraud , req.body);

 	taxfraud.save(function(err) {
 		if (err) {
 			return res.status(400).send({
 				message: errorHandler.getErrorMessage(err)
 			});
 		} else {
 			res.jsonp(taxfraud);
 		}
 	});
 };

/**
 * Delete an Taxfraud
 */
 exports.delete = function(req, res) {
 	var taxfraud = req.taxfraud ;

 	taxfraud.remove(function(err) {
 		if (err) {
 			return res.status(400).send({
 				message: errorHandler.getErrorMessage(err)
 			});
 		} else {
 			res.jsonp(taxfraud);
 		}
 	});
 };

/**
 * List of Taxfrauds
 */
 exports.list = function(req, res) { 
 	Taxfraud.find().sort('-created').populate('user', 'displayName').exec(function(err, taxfrauds) {
 		if (err) {
 			return res.status(400).send({
 				message: errorHandler.getErrorMessage(err)
 			});
 		} else {
 			res.jsonp(taxfrauds);
 		}
 	});
 };

/**
 * Taxfraud middleware
 */
 exports.taxfraudByID = function(req, res, next, id) { 
 	Taxfraud.findById(id).populate('user', 'displayName').exec(function(err, taxfraud) {
 		if (err) return next(err);
 		if (! taxfraud) return next(new Error('Failed to load Taxfraud ' + id));
 		req.taxfraud = taxfraud ;
 		next();
 	});
 };

/**
 * Taxfraud authorization middleware
 */
 exports.hasAuthorization = function(req, res, next) {
	/*if (req.taxfraud.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}*/
	/*if (!req.user.isAdmin) {
		return res.status(403).send('User is not authorized');
	}*/
	if (req.user.roles[0] !== 'admin') {
		return res.status(403).send('User is not authorized, needs to have administration rights');
	}
	next();
};
