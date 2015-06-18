'use strict';

/**
 * Module dependencies.
 */
 var should = require('should'),
 mongoose = require('mongoose'),
 User = mongoose.model('User'),
 Politician = mongoose.model('Politician'),
 Party = mongoose.model('Party');

/**
 * Globals
 */
 var user, party,politician;

/**
 * Unit tests
 */
 describe('Party Model Unit Tests:', function() {
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
 			party = new Party({
 				name: 'Party Name',
 				block: 'Party block',
 				user: user,
 				politicians: [politician]
 			});

 			done();
 		});
 	});

 	describe('Method Save', function() {
 		it('should be able to save without problems', function(done) {
 			return party.save(function(err) {
 				should.not.exist(err);
 				done();
 			});
 		});

 		it('should be able to show an error when try to save without name', function(done) { 
 			party.name = '';

 			return party.save(function(err) {
 				should.exist(err);
 				done();
 			});
 		});
 		it('should be able to save without block name', function(done) { 
 			party.block = '';

 			return party.save(function(err) {
 				should.not.exist(err);
 				done();
 			});
 		});
 	});

 	afterEach(function(done) { 
 		Party.remove().exec();
 		User.remove().exec();

 		done();
 	});
 });