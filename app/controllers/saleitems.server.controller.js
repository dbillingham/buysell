'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Saleitem = mongoose.model('Saleitem'),
	_ = require('lodash');

/**
 * Create a Saleitem
 */
exports.create = function(req, res) {
	var saleitem = new Saleitem(req.body);
	saleitem.user = req.user;

	saleitem.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(saleitem);
		}
	});
};

/**
 * Show the current Saleitem
 */
exports.read = function(req, res) {
	res.jsonp(req.saleitem);
};

/**
 * Update a Saleitem
 */
exports.update = function(req, res) {
	var saleitem = req.saleitem ;

	saleitem = _.extend(saleitem , req.body);

	saleitem.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(saleitem);
		}
	});
};

/**
 * Delete an Saleitem
 */
exports.delete = function(req, res) {
	var saleitem = req.saleitem ;

	saleitem.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(saleitem);
		}
	});
};

/**
 * List of Saleitems
 */
exports.list = function(req, res) { 
	Saleitem.find().sort('-created').populate('user', 'displayName').exec(function(err, saleitems) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(saleitems);
		}
	});
};

/**
 * Saleitem middleware
 */
exports.saleitemByID = function(req, res, next, id) { 
	Saleitem.findById(id).populate('user', 'displayName').exec(function(err, saleitem) {
		if (err) return next(err);
		if (! saleitem) return next(new Error('Failed to load Saleitem ' + id));
		req.saleitem = saleitem ;
		next();
	});
};

/**
 * Saleitem authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.saleitem.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
