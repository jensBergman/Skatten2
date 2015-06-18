'use strict';

/**
 * Module dependencies.
 */
 var should = require('should'),
 mongoose = require('mongoose'),
 User = mongoose.model('User'),
 Partytype = mongoose.model('Partytype');

/**
 * Globals
 */
 var user, partytype;

/**
 * Unit tests
 */
 describe('Partytype Model Unit Tests:', function() {
 	beforeEach(function(done) {
 		user = new User({
 			firstName: 'Full',
 			lastName: 'Name',
 			displayName: 'Full Name',
 			email: 'test@test.com',
 			username: 'username',
 			password: 'password'
 		});

 		user.save(function() { 
 			partytype = new Partytype({
 				area: 'Riksdag',
 				location: 'Sverige',
 				user: user
 			});

 			done();
 		});
 	});

 	describe('Method Save', function() {
 		it('should be able to save without problems', function(done) {
 			return partytype.save(function(err) {
 				should.not.exist(err);
 				done();
 			});
 		});

 		it('should be able to show an error when try to save without area (Riksdag, län, eller kommun)', function(done) { 
 			partytype.area = '';

 			return partytype.save(function(err) {
 				should.exist(err);
 				done();
 			});
 		});

 		it('should be able to show an error when try to save without location', function(done) { 
 			partytype.location = '';

 			return partytype.save(function(err) {
 				should.exist(err);
 				done();
 			});
 		});
 	});

 	afterEach(function(done) { 
 		Partytype.remove().exec();
 		User.remove().exec();

 		done();
 	});
 });