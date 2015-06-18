'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Party Schema
 */
var PartySchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Party name',
		trim: true
	},
	block: {
		type: String,
		default: 'none',
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

mongoose.model('Party', PartySchema);