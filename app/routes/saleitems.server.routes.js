'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var saleitems = require('../../app/controllers/saleitems.server.controller');

	// Saleitems Routes
	app.route('/saleitems')
		.get(saleitems.list)
		.post(users.requiresLogin, saleitems.create);

	app.route('/saleitems/:saleitemId')
		.get(saleitems.read)
		.put(users.requiresLogin, saleitems.hasAuthorization, saleitems.update)
		.delete(users.requiresLogin, saleitems.hasAuthorization, saleitems.delete);

	// Finish by binding the Saleitem middleware
	app.param('saleitemId', saleitems.saleitemByID);
};
