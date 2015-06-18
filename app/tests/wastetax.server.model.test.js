'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
 Politician = mongoose.model('Politician'),
	Wastetax = mongoose.model('Wastetax');

/**
 * Globals
 */
var user,politician, wastetax;

/**
 * Unit tests
 */
describe('Wastetax Model Unit Tests:', function() {
	beforeEach(function(done) {
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: 'username',
			password: 'password'
		});

		politician = new Politician({
 			name: 'Politician Name',
 			age: 40,
 			male: 'female'
 		});

		user.save(function() { 
			wastetax = new Wastetax({
 				title: 'Döds-stjärna',
 				price: 5000000,
 				description: 'Byggde en döds-stjärna för att förinta vargen',
 				source: 'www.skattehatare.se',
 				user: user,
 				politicians: [politician]
			});

			done();
		});
	});

	describe('Method Save', function() {
		it('should be able to save without problems', function(done) {
			return wastetax.save(function(err) {
				should.not.exist(err);
				done();
			});
		});

 		it('should be able to show an error when try to save without title', function(done) { 
 			wastetax.title = '';

 			return wastetax.save(function(err) {
 				should.exist(err);
 				done();
 			});
 		});

 		it('should be able to show an error when try to save without price', function(done) { 
 			wastetax.price = 0;

 			return wastetax.save(function(err) {
 				should.exist(err);
 				done();
 			});
 		});

 		it('should be able to show an error when try to save with negative price', function(done) { 
 			wastetax.price = -1;

 			return wastetax.save(function(err) {
 				should.exist(err);
 				done();
 			});
 		});

 		it('should be able to show an error when try to save without description', function(done) { 
 			wastetax.description = '';

 			return wastetax.save(function(err) {
 				should.exist(err);
 				done();
 			});
 		});

 		it('should be able to show an error when try to save without source', function(done) { 
 			wastetax.source = '';

 			return wastetax.save(function(err) {
 				should.exist(err);
 				done();
 			});
 		});
	});

	afterEach(function(done) { 
		Wastetax.remove().exec();
		User.remove().exec();

		done();
	});
});