'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Saleitem = mongoose.model('Saleitem'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, saleitem;

/**
 * Saleitem routes tests
 */
describe('Saleitem CRUD tests', function() {
	beforeEach(function(done) {
		// Create user credentials
		credentials = {
			username: 'username',
			password: 'password'
		};

		// Create a new user
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: credentials.username,
			password: credentials.password,
			provider: 'local'
		});

		// Save a user to the test db and create new Saleitem
		user.save(function() {
			saleitem = {
				name: 'Saleitem Name'
			};

			done();
		});
	});

	it('should be able to save Saleitem instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Saleitem
				agent.post('/saleitems')
					.send(saleitem)
					.expect(200)
					.end(function(saleitemSaveErr, saleitemSaveRes) {
						// Handle Saleitem save error
						if (saleitemSaveErr) done(saleitemSaveErr);

						// Get a list of Saleitems
						agent.get('/saleitems')
							.end(function(saleitemsGetErr, saleitemsGetRes) {
								// Handle Saleitem save error
								if (saleitemsGetErr) done(saleitemsGetErr);

								// Get Saleitems list
								var saleitems = saleitemsGetRes.body;

								// Set assertions
								(saleitems[0].user._id).should.equal(userId);
								(saleitems[0].name).should.match('Saleitem Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Saleitem instance if not logged in', function(done) {
		agent.post('/saleitems')
			.send(saleitem)
			.expect(401)
			.end(function(saleitemSaveErr, saleitemSaveRes) {
				// Call the assertion callback
				done(saleitemSaveErr);
			});
	});

	it('should not be able to save Saleitem instance if no name is provided', function(done) {
		// Invalidate name field
		saleitem.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Saleitem
				agent.post('/saleitems')
					.send(saleitem)
					.expect(400)
					.end(function(saleitemSaveErr, saleitemSaveRes) {
						// Set message assertion
						(saleitemSaveRes.body.message).should.match('Please fill Saleitem name');
						
						// Handle Saleitem save error
						done(saleitemSaveErr);
					});
			});
	});

	it('should be able to update Saleitem instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Saleitem
				agent.post('/saleitems')
					.send(saleitem)
					.expect(200)
					.end(function(saleitemSaveErr, saleitemSaveRes) {
						// Handle Saleitem save error
						if (saleitemSaveErr) done(saleitemSaveErr);

						// Update Saleitem name
						saleitem.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Saleitem
						agent.put('/saleitems/' + saleitemSaveRes.body._id)
							.send(saleitem)
							.expect(200)
							.end(function(saleitemUpdateErr, saleitemUpdateRes) {
								// Handle Saleitem update error
								if (saleitemUpdateErr) done(saleitemUpdateErr);

								// Set assertions
								(saleitemUpdateRes.body._id).should.equal(saleitemSaveRes.body._id);
								(saleitemUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Saleitems if not signed in', function(done) {
		// Create new Saleitem model instance
		var saleitemObj = new Saleitem(saleitem);

		// Save the Saleitem
		saleitemObj.save(function() {
			// Request Saleitems
			request(app).get('/saleitems')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Saleitem if not signed in', function(done) {
		// Create new Saleitem model instance
		var saleitemObj = new Saleitem(saleitem);

		// Save the Saleitem
		saleitemObj.save(function() {
			request(app).get('/saleitems/' + saleitemObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', saleitem.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Saleitem instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Saleitem
				agent.post('/saleitems')
					.send(saleitem)
					.expect(200)
					.end(function(saleitemSaveErr, saleitemSaveRes) {
						// Handle Saleitem save error
						if (saleitemSaveErr) done(saleitemSaveErr);

						// Delete existing Saleitem
						agent.delete('/saleitems/' + saleitemSaveRes.body._id)
							.send(saleitem)
							.expect(200)
							.end(function(saleitemDeleteErr, saleitemDeleteRes) {
								// Handle Saleitem error error
								if (saleitemDeleteErr) done(saleitemDeleteErr);

								// Set assertions
								(saleitemDeleteRes.body._id).should.equal(saleitemSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Saleitem instance if not signed in', function(done) {
		// Set Saleitem user 
		saleitem.user = user;

		// Create new Saleitem model instance
		var saleitemObj = new Saleitem(saleitem);

		// Save the Saleitem
		saleitemObj.save(function() {
			// Try deleting Saleitem
			request(app).delete('/saleitems/' + saleitemObj._id)
			.expect(401)
			.end(function(saleitemDeleteErr, saleitemDeleteRes) {
				// Set message assertion
				(saleitemDeleteRes.body.message).should.match('User is not logged in');

				// Handle Saleitem error error
				done(saleitemDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Saleitem.remove().exec();
		done();
	});
});