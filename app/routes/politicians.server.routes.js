'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var taxfrauds = require('../../app/controllers/taxfrauds.server.controller');
	var politicians = require('../../app/controllers/politicians.server.controller');


	// Politicians Routes
	app.route('/politicians')
		.get(politicians.list)
		.post(users.requiresLogin,politicians.hasAuthorization, politicians.create);

	app.route('/politicians/:politicianId')
		.get(politicians.read)
		.put(users.requiresLogin, politicians.hasAuthorization, politicians.update)
		.delete(users.requiresLogin, politicians.hasAuthorization, politicians.delete);

	// Finish by binding the Politician middleware
	app.param('politicianId', politicians.politicianByID);
};
