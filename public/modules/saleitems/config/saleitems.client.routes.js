'use strict';

//Setting up route
angular.module('saleitems').config(['$stateProvider',
	function($stateProvider) {
		// Saleitems state routing
		$stateProvider.
		state('listSaleitems', {
			url: '/saleitems',
			templateUrl: 'modules/saleitems/views/list-saleitems.client.view.html'
		}).
		state('createSaleitem', {
			url: '/saleitems/create',
			templateUrl: 'modules/saleitems/views/create-saleitem.client.view.html'
		}).
		state('viewSaleitem', {
			url: '/saleitems/:saleitemId',
			templateUrl: 'modules/saleitems/views/view-saleitem.client.view.html'
		}).
		state('editSaleitem', {
			url: '/saleitems/:saleitemId/edit',
			templateUrl: 'modules/saleitems/views/edit-saleitem.client.view.html'
		});
	}
]);