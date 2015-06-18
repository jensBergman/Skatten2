'use strict';

var should = require('should'),
request = require('supertest'),
app = require('../../server'),
mongoose = require('mongoose'),
User = mongoose.model('User'),
Partytype = mongoose.model('Partytype'),
agent = request.agent(app);

/**
 * Globals
 */
 var userCredential, adminCredential, user, admin, partytype;

/**
 * Partytype routes tests
 */
 describe('Partytype CRUD tests', function() {
 	beforeEach(function(done) {
		// Create user adminCredential
		userCredential = {
			username: 'username',
			password: 'password1'
		};

		// Create admin adminCredential
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

		// Create a new user
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

		// Save a user to the test db and create new Partytype
		user.save(function() {
			partytype = {
				area: 'Riksdag',
				location: 'Sverige'
			};
			admin.save(function(){
				done();
			});
			
		});
	});

 	it('should be able to save Partytype instance if logged in and admin', function(done) {
 		agent.post('/auth/signin')
 		.send(adminCredential)
 		.expect(200)
 		.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = admin.id;

				// Save a new Partytype
				agent.post('/partytypes')
				.send(partytype)
				.expect(200)
				.end(function(partytypeSaveErr, partytypeSaveRes) {
						// Handle Partytype save error
						if (partytypeSaveErr) done(partytypeSaveErr);

						// Get a list of Partytypes
						agent.get('/partytypes')
						.end(function(partytypesGetErr, partytypesGetRes) {
								// Handle Partytype save error
								if (partytypesGetErr) done(partytypesGetErr);

								// Get Partytypes list
								var partytypes = partytypesGetRes.body;

								// Set assertions
								(partytypes[0].user._id).should.equal(userId);
								(partytypes[0].area).should.match('Riksdag');

								// Call the assertion callback
								done();
							});
					});
			});
 	});

it('should not be able to save Partytype instance if logged in but not admin', function(done) {
	agent.post('/auth/signin')
	.send(userCredential)
	.expect(200)
	.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Partytype
				agent.post('/partytypes')
				.send(partytype)
				.expect(403)
				.end(function(partytypeSaveErr, partytypeSaveRes) {
					// Handle Partytype save error
					if (partytypeSaveErr) done(partytypeSaveErr);

					// Call the assertion callback
					done();
				});
			});
});

it('should not be able to save Partytype instance if not logged in', function(done) {
	agent.post('/partytypes')
	.send(partytype)
	.expect(401)
	.end(function(partytypeSaveErr, partytypeSaveRes) {
				// Call the assertion callback
				done(partytypeSaveErr);
			});
});

it('should not be able to save Partytype instance if no area is provided', function(done) {
		// Invalidate name field
		partytype.area = '';

		agent.post('/auth/signin')
		.send(adminCredential)
		.expect(200)
		.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Partytype
				agent.post('/partytypes')
				.send(partytype)
				.expect(400)
				.end(function(partytypeSaveErr, partytypeSaveRes) {
						// Set message assertion
						(partytypeSaveRes.body.message).should.match('Fyll i vilken utsträckning det gäller(riksdag, län eller kommun)');
						
						// Handle Partytype save error
						done(partytypeSaveErr);
					});
			});
	});

it('should not be able to save Partytype instance if no location is provided', function(done) {
		// Invalidate name field
		partytype.location = '';

		agent.post('/auth/signin')
		.send(adminCredential)
		.expect(200)
		.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Partytype
				agent.post('/partytypes')
				.send(partytype)
				.expect(400)
				.end(function(partytypeSaveErr, partytypeSaveRes) {
						// Set message assertion
						(partytypeSaveRes.body.message).should.match('Fyll i vilket län eller kommun det gäller (ifall riksdag skriv Sverige)');
						
						// Handle Partytype save error
						done(partytypeSaveErr);
					});
			});
	});	

it('should be able to update Partytype instance if signed in and admin', function(done) {
	agent.post('/auth/signin')
	.send(adminCredential)
	.expect(200)
	.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = admin.id;

				// Save a new Partytype
				agent.post('/partytypes')
				.send(partytype)
				.expect(200)
				.end(function(partytypeSaveErr, partytypeSaveRes) {
						// Handle Partytype save error
						if (partytypeSaveErr) done(partytypeSaveErr);

						// Update Partytype name
						partytype.area = 'Kommun';
						partytype.location = 'Timrå';

						// Update existing Partytype
						agent.put('/partytypes/' + partytypeSaveRes.body._id)
						.send(partytype)
						.expect(200)
						.end(function(partytypeUpdateErr, partytypeUpdateRes) {
								// Handle Partytype update error
								if (partytypeUpdateErr) done(partytypeUpdateErr);

								// Set assertions
								(partytypeUpdateRes.body._id).should.equal(partytypeSaveRes.body._id);
								(partytypeUpdateRes.body.area).should.match('Kommun');
								(partytypeUpdateRes.body.location).should.match('Timrå');

								// Call the assertion callback
								done();
							});
					});
			});
});

it('should not be able to update Partytype instance if signed in but not admin', function(done) {
	agent.post('/auth/signin')
	.send(userCredential)
	.expect(200)
	.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Partytype
				agent.post('/partytypes')
				.send(partytype)
				.expect(403)
				.end(function(partytypeSaveErr, partytypeSaveRes) {
						// Handle Partytype save error
						if (partytypeSaveErr) done(partytypeSaveErr);

						// Call the assertion callback
						done();
					});
			});
});

it('should be able to get a list of Partytypes if not signed in', function(done) {
		// Create new Partytype model instance
		var partytypeObj = new Partytype(partytype);

		// Save the Partytype
		partytypeObj.save(function() {
			// Request Partytypes
			request(app).get('/partytypes')
			.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


it('should not be able to get a single Partytype if not signed in', function(done) {
		// Create new Partytype model instance
		var partytypeObj = new Partytype(partytype);

		// Save the Partytype
		partytypeObj.save(function() {
			request(app).get('/partytypes/' + partytypeObj._id)
			.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('area', partytype.area);

					// Call the assertion callback
					done();
				});
		});
	});

it('should be able to delete Partytype instance if signed in and admin', function(done) {
	agent.post('/auth/signin')
	.send(adminCredential)
	.expect(200)
	.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = admin.id;

				// Save a new Partytype
				agent.post('/partytypes')
				.send(partytype)
				.expect(200)
				.end(function(partytypeSaveErr, partytypeSaveRes) {
						// Handle Partytype save error
						if (partytypeSaveErr) done(partytypeSaveErr);

						// Delete existing Partytype
						agent.delete('/partytypes/' + partytypeSaveRes.body._id)
						.send(partytype)
						.expect(200)
						.end(function(partytypeDeleteErr, partytypeDeleteRes) {
								// Handle Partytype error error
								if (partytypeDeleteErr) done(partytypeDeleteErr);

								// Set assertions
								(partytypeDeleteRes.body._id).should.equal(partytypeSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
});

it('should not be able to delete Partytype instance if signed in but not admin', function(done) {
	agent.post('/auth/signin')
	.send(userCredential)
	.expect(200)
	.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Partytype
				agent.post('/partytypes')
				.send(partytype)
				.expect(403)
				.end(function(partytypeSaveErr, partytypeSaveRes) {
						// Handle Partytype save error
						if (partytypeSaveErr) done(partytypeSaveErr);

						// Call the assertion callback
						done();
					});
			});
});

it('should not be able to delete Partytype instance if not signed in', function(done) {
		// Set Partytype user 
		partytype.user = user;

		// Create new Partytype model instance
		var partytypeObj = new Partytype(partytype);

		// Save the Partytype
		partytypeObj.save(function() {
			// Try deleting Partytype
			request(app).delete('/partytypes/' + partytypeObj._id)
			.expect(401)
			.end(function(partytypeDeleteErr, partytypeDeleteRes) {
				// Set message assertion
				(partytypeDeleteRes.body.message).should.match('User is not logged in');

				// Handle Partytype error error
				done(partytypeDeleteErr);
			});

		});
	});

afterEach(function(done) {
	User.remove().exec();
	Partytype.remove().exec();
	done();
});
});