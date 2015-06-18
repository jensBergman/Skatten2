'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Politician = mongoose.model('Politician'),
	Party = mongoose.model('Party'),
	agent = request.agent(app);

/**
 * Globals
 */
var userCredential, user, adminCredential, admin, party;

/**
 * Party routes tests
 */
describe('Party CRUD tests', function() {
	beforeEach(function(done) {
		// Create user adminCredential
		userCredential= {
			username: 'username',
			password: 'password1'
		};
		adminCredential = {
			username: 'adminname',
			password: 'password2'
		};

		// Create a new user
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: userCredential.username,
			password: userCredential.password,
			provider: 'local',
			roles: ['user']
		});

				// Create a new admin
		admin = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: adminCredential.username,
			password: adminCredential.password,
			provider: 'local',
			roles: ['admin']
		});

		// Save a user to the test db and create new Party
		user.save(function() {
			party = {
				name: 'Party Name'
			};

			admin.save(function() {
				done();
			});
		});
	});

	it('should be able to save Party instance if logged in and admin', function(done) {
		agent.post('/auth/signin')
			.send(adminCredential)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = admin.id;

				// Save a new Party
				agent.post('/parties')
					.send(party)
					.expect(200)
					.end(function(partySaveErr, partySaveRes) {
						// Handle Party save error
						if (partySaveErr) done(partySaveErr);

						// Get a list of Parties
						agent.get('/parties')
							.end(function(partiesGetErr, partiesGetRes) {
								// Handle Party save error
								if (partiesGetErr) done(partiesGetErr);

								// Get Parties list
								var parties = partiesGetRes.body;

								// Set assertions
								(parties[0].user._id).should.equal(userId);
								(parties[0].name).should.match('Party Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save party instance if logged in but not admin', function(done) {
		agent.post('/auth/signin')
			.send(userCredential)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Taxfraud
				agent.post('/parties')
					.send(party)
					.expect(403)
					.end(function(taxfraudSaveErr, taxfraudSaveRes) {
						// Handle Taxfraud save error
						if (taxfraudSaveErr) done(taxfraudSaveErr);

						// Call the assertion callback
						done();
					});
			});
	});

	it('should not be able to save Party instance if not logged in', function(done) {
		agent.post('/parties')
			.send(party)
			.expect(401)
			.end(function(partySaveErr, partySaveRes) {
				// Call the assertion callback
				done(partySaveErr);
			});
	});

	it('should be able to update Party instance if signed in and admin', function(done) {
		agent.post('/auth/signin')
			.send(adminCredential)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = admin.id;

				// Save a new Party
				agent.post('/parties')
					.send(party)
					.expect(200)
					.end(function(partySaveErr, partySaveRes) {
						// Handle Party save error
						if (partySaveErr) done(partySaveErr);

						// Update Party name
						party.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Party
						agent.put('/parties/' + partySaveRes.body._id)
							.send(party)
							.expect(200)
							.end(function(partyUpdateErr, partyUpdateRes) {
								// Handle Party update error
								if (partyUpdateErr) done(partyUpdateErr);

								// Set assertions
								(partyUpdateRes.body._id).should.equal(partySaveRes.body._id);
								(partyUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Parties if not signed in', function(done) {
		// Create new Party model instance
		var partyObj = new Party(party);

		// Save the Party
		partyObj.save(function() {
			// Request Parties
			request(app).get('/parties')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Party if not signed in', function(done) {
		// Create new Party model instance
		var partyObj = new Party(party);

		// Save the Party
		partyObj.save(function() {
			request(app).get('/parties/' + partyObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', party.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Party instance if signed in and admin', function(done) {
		agent.post('/auth/signin')
			.send(adminCredential)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = admin.id;

				// Save a new Party
				agent.post('/parties')
					.send(party)
					.expect(200)
					.end(function(partySaveErr, partySaveRes) {
						// Handle Party save error
						if (partySaveErr) done(partySaveErr);

						// Delete existing Party
						agent.delete('/parties/' + partySaveRes.body._id)
							.send(party)
							.expect(200)
							.end(function(partyDeleteErr, partyDeleteRes) {
								// Handle Party error error
								if (partyDeleteErr) done(partyDeleteErr);

								// Set assertions
								(partyDeleteRes.body._id).should.equal(partySaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Party instance if not signed in', function(done) {
		// Set Party user 
		party.user = user;

		// Create new Party model instance
		var partyObj = new Party(party);

		// Save the Party
		partyObj.save(function() {
			// Try deleting Party
			request(app).delete('/parties/' + partyObj._id)
			.expect(401)
			.end(function(partyDeleteErr, partyDeleteRes) {
				// Set message assertion
				(partyDeleteRes.body.message).should.match('User is not logged in');

				// Handle Party error error
				done(partyDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Party.remove().exec();
		done();
	});
});