'use strict';

var should = require('should'),
request = require('supertest'),
app = require('../../server'),
mongoose = require('mongoose'),
User = mongoose.model('User'),
Politician = mongoose.model('Politician'),
Wastetax = mongoose.model('Wastetax'),
agent = request.agent(app);

/**
 * Globals
 */
 var userCredential, user, adminCredential, admin, wastetax;

/**
 * Wastetax routes tests
 */
 describe('Wastetax CRUD tests', function() {
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

		// Save a user to the test db and create new Wastetax
		user.save(function() {
			wastetax = {
				title: 'Döds-stjärna',
				price: 5000000,
				description: 'Byggde en döds-stjärna för att förinta vargen',
				source: 'www.skattehatare.se',
			};

			admin.save(function() {
				done();
			});
		});
	});

it('should be able to save Wastetax instance if logged in and admin', function(done) {
	agent.post('/auth/signin')
	.send(adminCredential)
	.expect(200)
	.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = admin.id;

				// Save a new Wastetax
				agent.post('/wastetaxes')
				.send(wastetax)
				.expect(200)
				.end(function(wastetaxSaveErr, wastetaxSaveRes) {
						// Handle Wastetax save error
						if (wastetaxSaveErr) done(wastetaxSaveErr);

						// Get a list of Wastetaxes
						agent.get('/wastetaxes')
						.end(function(wastetaxesGetErr, wastetaxesGetRes) {
								// Handle Wastetax save error
								if (wastetaxesGetErr) done(wastetaxesGetErr);

								// Get Wastetaxes list
								var wastetaxes = wastetaxesGetRes.body;

								// Set assertions
								(wastetaxes[0].user._id).should.equal(userId);
								(wastetaxes[0].title).should.match('Döds-stjärna');

								// Call the assertion callback
								done();
							});
					});
			});
});

	it('should not be able to save Wastetax instance if logged in but not admin', function(done) {
		agent.post('/auth/signin')
			.send(userCredential)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Taxfraud
				agent.post('/wastetaxes')
					.send(wastetax)
					.expect(403)
					.end(function(taxfraudSaveErr, taxfraudSaveRes) {
						// Handle Taxfraud save error
						if (taxfraudSaveErr) done(taxfraudSaveErr);

						// Call the assertion callback
						done();
					});
			});
	});

it('should not be able to save Wastetax instance if not logged in', function(done) {
	agent.post('/wastetaxes')
	.send(wastetax)
	.expect(401)
	.end(function(wastetaxSaveErr, wastetaxSaveRes) {
				// Call the assertion callback
				done(wastetaxSaveErr);
			});
});

it('should be able to update Wastetax instance if signed in and admin', function(done) {
	agent.post('/auth/signin')
	.send(adminCredential)
	.expect(200)
	.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = admin.id;

				// Save a new Wastetax
				agent.post('/wastetaxes')
				.send(wastetax)
				.expect(200)
				.end(function(wastetaxSaveErr, wastetaxSaveRes) {
						// Handle Wastetax save error
						if (wastetaxSaveErr) done(wastetaxSaveErr);

						// Update Wastetax name
						wastetax.title = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Wastetax
						agent.put('/wastetaxes/' + wastetaxSaveRes.body._id)
						.send(wastetax)
						.expect(200)
						.end(function(wastetaxUpdateErr, wastetaxUpdateRes) {
								// Handle Wastetax update error
								if (wastetaxUpdateErr) done(wastetaxUpdateErr);

								// Set assertions
								(wastetaxUpdateRes.body._id).should.equal(wastetaxSaveRes.body._id);
								(wastetaxUpdateRes.body.title).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
});

it('should be able to get a list of Wastetaxes if not signed in', function(done) {
		// Create new Wastetax model instance
		var wastetaxObj = new Wastetax(wastetax);

		// Save the Wastetax
		wastetaxObj.save(function() {
			// Request Wastetaxes
			request(app).get('/wastetaxes')
			.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


it('should be able to get a single Wastetax if not signed in', function(done) {
		// Create new Wastetax model instance
		var wastetaxObj = new Wastetax(wastetax);

		// Save the Wastetax
		wastetaxObj.save(function() {
			request(app).get('/wastetaxes/' + wastetaxObj._id)
			.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('title', wastetax.title);

					// Call the assertion callback
					done();
				});
		});
	});

it('should be able to delete Wastetax instance if signed in', function(done) {
	agent.post('/auth/signin')
	.send(adminCredential)
	.expect(200)
	.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = admin.id;

				// Save a new Wastetax
				agent.post('/wastetaxes')
				.send(wastetax)
				.expect(200)
				.end(function(wastetaxSaveErr, wastetaxSaveRes) {
						// Handle Wastetax save error
						if (wastetaxSaveErr) done(wastetaxSaveErr);

						// Delete existing Wastetax
						agent.delete('/wastetaxes/' + wastetaxSaveRes.body._id)
						.send(wastetax)
						.expect(200)
						.end(function(wastetaxDeleteErr, wastetaxDeleteRes) {
								// Handle Wastetax error error
								if (wastetaxDeleteErr) done(wastetaxDeleteErr);

								// Set assertions
								(wastetaxDeleteRes.body._id).should.equal(wastetaxSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
});

it('should not be able to delete Wastetax instance if not signed in', function(done) {
		// Set Wastetax user 
		wastetax.user = user;

		// Create new Wastetax model instance
		var wastetaxObj = new Wastetax(wastetax);

		// Save the Wastetax
		wastetaxObj.save(function() {
			// Try deleting Wastetax
			request(app).delete('/wastetaxes/' + wastetaxObj._id)
			.expect(401)
			.end(function(wastetaxDeleteErr, wastetaxDeleteRes) {
				// Set message assertion
				(wastetaxDeleteRes.body.message).should.match('User is not logged in');

				// Handle Wastetax error error
				done(wastetaxDeleteErr);
			});

		});
	});

afterEach(function(done) {
	User.remove().exec();
	Wastetax.remove().exec();
	done();
});
});