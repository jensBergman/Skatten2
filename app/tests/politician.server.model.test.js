'use strict';

/**
 * Module dependencies.
 */
 var should = require('should'),
 mongoose = require('mongoose'),
 User = mongoose.model('User'),
 Taxfraud = mongoose.model('Taxfraud'),
 Wastetax = mongoose.model('Wastetax'),
 Party = mongoose.model('Party'),
 Partytype = mongoose.model('Partytype'),
 Politician = mongoose.model('Politician');

/**
 * Globals
 */
 var user, politician, taxfraud, wastetax, party, partytype;

/**
 * Unit tests
 */
 describe('Politician Model Unit Tests:', function() {
 	beforeEach(function(done) {
 		user = new User({
 			firstName: 'Full',
 			lastName: 'Name',
 			displayName: 'Full Name',
 			email: 'test@test.com',
 			username: 'username',
 			password: 'password'
 		});

 		taxfraud = new Taxfraud({
 			title: 'Bostadsskatt',
 			price: 300,
 			description: 'Inte betalat skatt för privat bostad',
 			source: 'www.skattehatare.se',

 		});

 		wastetax = new Wastetax({
 			title: 'Bostadsskatt',
 			price: 300,
 			description: 'Inte betalat skatt för privat bostad',
 			source: 'www.skattehatare.se',

 		});
 		party = new Party({
 			name: 'party name'

 		});
 		partytype = new Partytype({
 			area: 'Riksdag',
 			location: 'Sverige'
 		});

 		user.save(function() { 
 			politician = new Politician({
 				name: 'Politician Name',
 				age: 40,
 				male: 'female',
 				user: user,
 				taxfrauds: [taxfraud],
 				wastetaxs: [wastetax],
 				party: party,
 				partyType: partytype
 			});

 			done();
 		});
 	});

 	describe('Method Save', function() {
 		it('should be able to save without problems', function(done) {
 			return politician.save(function(err) {
 				should.not.exist(err);
 				done();
 			});
 		});

 		it('should be able to show an error when try to save without name', function(done) { 
 			politician.name = '';

 			return politician.save(function(err) {
 				should.exist(err);
 				done();
 			});
 		});
 		it('should be able to show an error when try to save without age', function(done) { 
 			politician.age = '';

 			return politician.save(function(err) {
 				should.exist(err);
 				done();
 			});
 		});
 		it('should be able to show an error when try to save without male', function(done) { 
 			politician.male = '';

 			return politician.save(function(err) {
 				should.exist(err);
 				done();
 			});
 		});
 	});

 	afterEach(function(done) { 
 		Politician.remove().exec();
 		User.remove().exec();

 		done();
 	});
 });