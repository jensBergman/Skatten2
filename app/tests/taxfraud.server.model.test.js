'use strict';

/**
 * Module dependencies.
 */
 var should = require('should'),
 mongoose = require('mongoose'),
 User = mongoose.model('User'),
 Politician = mongoose.model('Politician'),
 Taxfraud = mongoose.model('Taxfraud');

/**
 * Globals
 */
 var user, taxfraud, politician;

/**
 * Unit tests
 */
 describe('Taxfraud Model Unit Tests:', function() {
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
 			taxfraud = new Taxfraud({
 				title: 'Bostadsskatt',
 				price: 300,
 				description: 'Inte betalat skatt för privat bostad',
 				source: 'www.skattehatare.se',
 				user: user,
 				politicians: [politician]
 			});

 			done();
 		});
 	});

 	describe('Method Save', function() {
 		it('should be able to save without problems', function(done) {
 			return taxfraud.save(function(err) {
 				should.not.exist(err);
 				done();
 			});
 		});

 		it('should be able to show an error when try to save without title', function(done) { 
 			taxfraud.title = '';

 			return taxfraud.save(function(err) {
 				should.exist(err);
 				done();
 			});
 		});

 		it('should be able to show an error when try to save without price', function(done) { 
 			taxfraud.price = 0;

 			return taxfraud.save(function(err) {
 				should.exist(err);
 				done();
 			});
 		});

 		it('should be able to show an error when try to save with negative price', function(done) { 
 			taxfraud.price = -1;

 			return taxfraud.save(function(err) {
 				should.exist(err);
 				done();
 			});
 		});

 		it('should be able to show an error when try to save without description', function(done) { 
 			taxfraud.description = '';

 			return taxfraud.save(function(err) {
 				should.exist(err);
 				done();
 			});
 		});

 		it('should be able to show an error when try to save without source', function(done) { 
 			taxfraud.source = '';

 			return taxfraud.save(function(err) {
 				should.exist(err);
 				done();
 			});
 		});
 	});

afterEach(function(done) { 
	Taxfraud.remove().exec();
	User.remove().exec();

	done();
});
});