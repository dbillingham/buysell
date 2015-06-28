'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Bid Schema
 */
var BidSchema = new Schema({
	amount: {
		type: Number,
		default: 0,
		required: 'Please fill Bid amount',
		trim: true
	},
	saleItemId: {
		type: String,
		default: '',
		required: 'No sale item GUID',
		trim: true
	},
	accepted: {
		type: Boolean,
		default: false
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

mongoose.model('Bid', BidSchema);