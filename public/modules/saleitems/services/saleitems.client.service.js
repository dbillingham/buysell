'use strict';

//Saleitems service used to communicate Saleitems REST endpoints
angular.module('saleitems').factory('Saleitems', ['$resource',
	function($resource) {
		return $resource('saleitems/:saleitemId', { saleitemId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);