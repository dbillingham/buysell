'use strict';

// Configuring the Articles module
angular.module('saleitems').run(['Menus', 'Authentication',
	function(Menus, Authentication) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Saleitems', 'saleitems', 'dropdown', '/saleitems(/create)?');
		Menus.addSubMenuItem('topbar', 'saleitems', 'List Saleitems', 'saleitems');
		Menus.addSubMenuItem('topbar', 'saleitems', 'New Saleitem', 'saleitems/create',undefined,undefined,['seller'],undefined);	
	}
]);