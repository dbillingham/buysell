'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Saleitem Schema
 */
var SaleitemSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill in a name',
		trim: true
	},
	description: {
		type: String,
		default: '',
		trim: true
	},
	price: {
		type: Number,
		default: 0,
		required: 'Please fill in a price',
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

mongoose.model('Saleitem', SaleitemSchema);