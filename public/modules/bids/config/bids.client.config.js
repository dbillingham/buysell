'use strict';

// Configuring the Articles module
angular.module('bids').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Bids', 'bids', 'dropdown', '/bids(/create)?');
		Menus.addSubMenuItem('topbar', 'bids', 'List Bids', 'bids',undefined,undefined,['buyer'],undefined);
	}
]);