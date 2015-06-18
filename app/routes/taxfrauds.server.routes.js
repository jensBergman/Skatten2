'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var politicians = require('../../app/controllers/politicians.server.controller');	
	var taxfrauds = require('../../app/controllers/taxfrauds.server.controller');

	// Taxfrauds Routes
	app.route('/taxfrauds')
		.get(taxfrauds.list)
		.post(users.requiresLogin, taxfrauds.hasAuthorization, taxfrauds.create);

	app.route('/taxfrauds/:taxfraudId')
		.get(taxfrauds.read)
		.put(users.requiresLogin, taxfrauds.hasAuthorization, taxfrauds.update)
		.delete(users.requiresLogin, taxfrauds.hasAuthorization, taxfrauds.delete);

	// Finish by binding the Taxfraud middleware
	app.param('taxfraudId', taxfrauds.taxfraudByID);
};
