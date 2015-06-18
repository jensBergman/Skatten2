'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var partytypes = require('../../app/controllers/partytypes.server.controller');

	// Partytypes Routes
	app.route('/partytypes')
		.get(partytypes.list)
		.post(users.requiresLogin, partytypes.hasAuthorization, partytypes.create);

	app.route('/partytypes/:partytypeId')
		.get(partytypes.read)
		.put(users.requiresLogin, partytypes.hasAuthorization, partytypes.update)
		.delete(users.requiresLogin, partytypes.hasAuthorization, partytypes.delete);

	// Finish by binding the Partytype middleware
	app.param('partytypeId', partytypes.partytypeByID);
};
