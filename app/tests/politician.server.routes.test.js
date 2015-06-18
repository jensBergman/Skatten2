'use strict';

var should = require('should'),
request = require('supertest'),
app = require('../../server'),
mongoose = require('mongoose'),
User = mongoose.model('User'),
Taxfraud = mongoose.model('Taxfraud'),
Politician = mongoose.model('Politician'),
agent = request.agent(app);

/**
 * Globals
 */
 var userCredential, user, adminCredential, admin, politician;

/**
 * Politician routes tests
 */
 describe('Politician CRUD tests', function() {
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

		// Save a user to the test db and create new Politician
		user.save(function() {
			politician = {
				name: 'Politician Name',
				age: 40,
				male: 'female'
			};
			admin.save(function() {
				done();
			});
		});
	});

 	it('should be able to save Politician instance if logged in and admin', function(done) {
 		agent.post('/auth/signin')
 		.send(adminCredential)
 		.expect(200)
 		.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = admin.id;

				// Save a new Politician
				agent.post('/politicians')
				.send(politician)
				.expect(200)
				.end(function(politicianSaveErr, politicianSaveRes) {
						// Handle Politician save error
						if (politicianSaveErr) done(politicianSaveErr);

						// Get a list of Politicians
						agent.get('/politicians')
						.end(function(politiciansGetErr, politiciansGetRes) {
								// Handle Politician save error
								if (politiciansGetErr) done(politiciansGetErr);

								// Get Politicians list
								var politicians = politiciansGetRes.body;

								// Set assertions
								(politicians[0].user._id).should.equal(userId);
								(politicians[0].name).should.match('Politician Name');

								// Call the assertion callback
								done();
							});
					});
			});
 	});

it('should not be able to save Politician instance if logged in but not admin', function(done) {
	agent.post('/auth/signin')
	.send(userCredential)
	.expect(200)
	.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Politician
				agent.post('/politicians')
				.send(politician)
				.expect(403)
				.end(function(politicianSaveErr, politicianSaveRes) {
					// Handle Politician save error
					if (politicianSaveErr) done(politicianSaveErr);

					// Call the assertion callback
					done();
				});
			});
});

it('should not be able to save Politician instance if not logged in', function(done) {
	agent.post('/politicians')
	.send(politician)
	.expect(401)
	.end(function(politicianSaveErr, politicianSaveRes) {
				// Call the assertion callback
				done(politicianSaveErr);
			});
});


it('should be able to update Politician instance if signed in', function(done) {
	agent.post('/auth/signin')
	.send(adminCredential)
	.expect(200)
	.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Politician
				agent.post('/politicians')
				.send(politician)
				.expect(200)
				.end(function(politicianSaveErr, politicianSaveRes) {
						// Handle Politician save error
						if (politicianSaveErr) done(politicianSaveErr);

						// Update Politician name
						politician.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Politician
						agent.put('/politicians/' + politicianSaveRes.body._id)
						.send(politician)
						.expect(200)
						.end(function(politicianUpdateErr, politicianUpdateRes) {
								// Handle Politician update error
								if (politicianUpdateErr) done(politicianUpdateErr);

								// Set assertions
								(politicianUpdateRes.body._id).should.equal(politicianSaveRes.body._id);
								(politicianUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
});

it('should be able to get a list of Politicians if not signed in', function(done) {
		// Create new Politician model instance
		var politicianObj = new Politician(politician);

		// Save the Politician
		politicianObj.save(function() {
			// Request Politicians
			request(app).get('/politicians')
			.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


it('should be able to get a single Politician if not signed in', function(done) {
		// Create new Politician model instance
		var politicianObj = new Politician(politician);

		// Save the Politician
		politicianObj.save(function() {
			request(app).get('/politicians/' + politicianObj._id)
			.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', politician.name);

					// Call the assertion callback
					done();
				});
		});
	});

it('should be able to delete Politician instance if signed in', function(done) {
	agent.post('/auth/signin')
	.send(adminCredential)
	.expect(200)
	.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Politician
				agent.post('/politicians')
				.send(politician)
				.expect(200)
				.end(function(politicianSaveErr, politicianSaveRes) {
						// Handle Politician save error
						if (politicianSaveErr) done(politicianSaveErr);

						// Delete existing Politician
						agent.delete('/politicians/' + politicianSaveRes.body._id)
						.send(politician)
						.expect(200)
						.end(function(politicianDeleteErr, politicianDeleteRes) {
								// Handle Politician error error
								if (politicianDeleteErr) done(politicianDeleteErr);

								// Set assertions
								(politicianDeleteRes.body._id).should.equal(politicianSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
});

it('should not be able to delete Politician instance if not signed in', function(done) {
		// Set Politician user 
		politician.user = user;

		// Create new Politician model instance
		var politicianObj = new Politician(politician);

		// Save the Politician
		politicianObj.save(function() {
			// Try deleting Politician
			request(app).delete('/politicians/' + politicianObj._id)
			.expect(401)
			.end(function(politicianDeleteErr, politicianDeleteRes) {
				// Set message assertion
				(politicianDeleteRes.body.message).should.match('User is not logged in');

				// Handle Politician error error
				done(politicianDeleteErr);
			});

		});
	});

afterEach(function(done) {
	User.remove().exec();
	Politician.remove().exec();
	done();
});
});