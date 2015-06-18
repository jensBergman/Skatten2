'use strict';

/**
 * Module dependencies.
 */
 var mongoose = require('mongoose'),
 Schema = mongoose.Schema;

/**
* Validation
*/
function getPrice(num){
	return (num/100).toFixed(2);
}

function setPrice(num){
	return num*100;
}

function validateLength (v) {
  // a custom validation function for checking string length to be used by the model
  return v.length <= 150;
}

function validatePrice(v) {
  // can't have a negative value and must have a price
  return v > 0;
}

/**
 * Taxfraud Schema
 */
 var TaxfraudSchema = new Schema({
 	title: {
 		type: String,
 		default: '',
 		required: 'Please fill Taxfraud title',
 		trim: true
 	},
 	price: {
 		type: Number,
 		default: 0,
 		get: getPrice, set: setPrice, 
 		required: 'Please fill Taxfraud price',validate: [validatePrice, 'only positive values allowed'],
 	},
 	description: {
 		type: String,
 		default: '',
 		validate: [validateLength, 'name must be 150 chars in length or less'],
 		required: 'Please fill Taxfraud description',
 		trim: true
 	},
 	source: {
 		type: String,
 		default: '',
 		required: 'Please fill Taxfraud source',
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
 	politicians: [{
		type: Schema.ObjectId,
		ref: 'Politician'
	}]
	});

 mongoose.model('Taxfraud', TaxfraudSchema);