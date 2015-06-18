'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var politicians = require('../../app/controllers/politicians.server.controller');
	var wastetaxes = require('../../app/controllers/wastetaxes.server.controller');

	// Wastetaxes Routes
	app.route('/wastetaxes')
		.get(wastetaxes.list)
		.post(users.requiresLogin, wastetaxes.hasAuthorization, wastetaxes.create);

	app.route('/wastetaxes/:wastetaxId')
		.get(wastetaxes.read)
		.put(users.requiresLogin, wastetaxes.hasAuthorization, wastetaxes.update)
		.delete(users.requiresLogin, wastetaxes.hasAuthorization, wastetaxes.delete);

	// Finish by binding the Wastetax middleware
	app.param('wastetaxId', wastetaxes.wastetaxByID);
};
