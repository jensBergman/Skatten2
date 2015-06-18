'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/** 
* Validation
*/
function validateAge(v) {
  // can't have a negative value and must have a price
  return v >= 0;
}

/**
 * Politician Schema
 */
 var PoliticianSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Politician name',
		trim: true
	},
		age: {
		type: Number,
		default: 0,
		required: 'Please fill Politician age',
		validate: [validateAge, 'an age cannot be negative'],
		trim: true
	},
		male: {
		type: String,
		default: '',
		required: 'Please fill Politician male (male/female)',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	},
	taxfrauds: [{
		type: Schema.ObjectId,
		ref: 'Taxfraud'
	}],
	wastetax: [{
		type: Schema.ObjectId,
		ref: 'Wastetax'
	}],
	party: {
		type: Schema.ObjectId,
		ref: 'Party'
	},
	partyType: {
		type: Schema.ObjectId,
		ref: 'Partytype'
	}
});

mongoose.model('Politician', PoliticianSchema);