'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Partytype Schema
 */
var PartytypeSchema = new Schema({
	area: {
		type: String,
		default: '',
		required: 'Fyll i vilken utsträckning det gäller(riksdag, län eller kommun)',
		trim: true
	},
	location: {
		type: String,
		default: '',
		required: 'Fyll i vilket län eller kommun det gäller (ifall riksdag skriv Sverige)',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Partytype', PartytypeSchema);