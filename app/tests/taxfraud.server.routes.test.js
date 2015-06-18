'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Politician = mongoose.model('Politician'),
	Taxfraud = mongoose.model('Taxfraud'),
	agent = request.agent(app);

/**
 * Globals
 */
var userCredential, user, adminCredential, admin, taxfraud;

/**
 * Taxfraud routes tests
 */
describe('Taxfraud CRUD tests', function() {
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

		// Save a user to the test db and create new Taxfraud
		user.save(function() {
			taxfraud = {
				title: 'Bostadsskatt',
				price: 300,
				description: 'Inte betalat skatt för privat bostad',
				source: 'www.skattehatare.se'
			};
			admin.save(function() {
				done();
			});
		});
	});

	it('should be able to save Taxfraud instance if logged in and admin', function(done) {
		agent.post('/auth/signin')
			.send(adminCredential)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = admin.id;

				// Save a new Taxfraud
				agent.post('/taxfrauds')
					.send(taxfraud)
					.expect(200)
					.end(function(taxfraudSaveErr, taxfraudSaveRes) {
						// Handle Taxfraud save error
						if (taxfraudSaveErr) done(taxfraudSaveErr);

						// Get a list of Taxfrauds
						agent.get('/taxfrauds')
							.end(function(taxfraudsGetErr, taxfraudsGetRes) {
								// Handle Taxfraud save error
								if (taxfraudsGetErr) done(taxfraudsGetErr);

								// Get Taxfrauds list
								var taxfrauds = taxfraudsGetRes.body;

								// Set assertions
								(taxfrauds[0].user._id).should.equal(userId);
								(taxfrauds[0].title).should.match('Bostadsskatt');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Taxfraud instance if logged in but not admin', function(done) {
		agent.post('/auth/signin')
			.send(userCredential)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Taxfraud
				agent.post('/taxfrauds')
					.send(taxfraud)
					.expect(403)
					.end(function(taxfraudSaveErr, taxfraudSaveRes) {
						// Handle Taxfraud save error
						if (taxfraudSaveErr) done(taxfraudSaveErr);

						// Call the assertion callback
						done();
					});
			});
	});

	it('should not be able to save Taxfraud instance if not logged in', function(done) {
		agent.post('/taxfrauds')
			.send(taxfraud)
			.expect(401)
			.end(function(taxfraudSaveErr, taxfraudSaveRes) {
				// Call the assertion callback
				done(taxfraudSaveErr);
			});
	});

	it('should not be able to save Taxfraud instance if no name is provided', function(done) {
		// Invalidate name field
		taxfraud.title = '';

		agent.post('/auth/signin')
			.send(adminCredential)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = admin.id;

				// Save a new Taxfraud
				agent.post('/taxfrauds')
					.send(taxfraud)
					.expect(400)
					.end(function(taxfraudSaveErr, taxfraudSaveRes) {
						// Set message assertion
						(taxfraudSaveRes.body.message).should.match('Please fill Taxfraud title');
						
						// Handle Taxfraud save error
						done(taxfraudSaveErr);
					});
			});
	});

	it('should be able to update Taxfraud instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(adminCredential)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = admin.id;

				// Save a new Taxfraud
				agent.post('/taxfrauds')
					.send(taxfraud)
					.expect(200)
					.end(function(taxfraudSaveErr, taxfraudSaveRes) {
						// Handle Taxfraud save error
						if (taxfraudSaveErr) done(taxfraudSaveErr);

						// Update Taxfraud name
						taxfraud.title = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Taxfraud
						agent.put('/taxfrauds/' + taxfraudSaveRes.body._id)
							.send(taxfraud)
							.expect(200)
							.end(function(taxfraudUpdateErr, taxfraudUpdateRes) {
								// Handle Taxfraud update error
								if (taxfraudUpdateErr) done(taxfraudUpdateErr);

								// Set assertions
								(taxfraudUpdateRes.body._id).should.equal(taxfraudSaveRes.body._id);
								(taxfraudUpdateRes.body.title).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Taxfrauds if not signed in', function(done) {
		// Create new Taxfraud model instance
		var taxfraudObj = new Taxfraud(taxfraud);

		// Save the Taxfraud
		taxfraudObj.save(function() {
			// Request Taxfrauds
			request(app).get('/taxfrauds')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Taxfraud if not signed in', function(done) {
		// Create new Taxfraud model instance
		var taxfraudObj = new Taxfraud(taxfraud);

		// Save the Taxfraud
		taxfraudObj.save(function() {
			request(app).get('/taxfrauds/' + taxfraudObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('title', taxfraud.title);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Taxfraud instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(adminCredential)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = admin.id;

				// Save a new Taxfraud
				agent.post('/taxfrauds')
					.send(taxfraud)
					.expect(200)
					.end(function(taxfraudSaveErr, taxfraudSaveRes) {
						// Handle Taxfraud save error
						if (taxfraudSaveErr) done(taxfraudSaveErr);

						// Delete existing Taxfraud
						agent.delete('/taxfrauds/' + taxfraudSaveRes.body._id)
							.send(taxfraud)
							.expect(200)
							.end(function(taxfraudDeleteErr, taxfraudDeleteRes) {
								// Handle Taxfraud error error
								if (taxfraudDeleteErr) done(taxfraudDeleteErr);

								// Set assertions
								(taxfraudDeleteRes.body._id).should.equal(taxfraudSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Taxfraud instance if not signed in', function(done) {
		// Set Taxfraud user 
		taxfraud.user = user;

		// Create new Taxfraud model instance
		var taxfraudObj = new Taxfraud(taxfraud);

		// Save the Taxfraud
		taxfraudObj.save(function() {
			// Try deleting Taxfraud
			request(app).delete('/taxfrauds/' + taxfraudObj._id)
			.expect(401)
			.end(function(taxfraudDeleteErr, taxfraudDeleteRes) {
				// Set message assertion
				(taxfraudDeleteRes.body.message).should.match('User is not logged in');

				// Handle Taxfraud error error
				done(taxfraudDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Taxfraud.remove().exec();
		done();
	});
});