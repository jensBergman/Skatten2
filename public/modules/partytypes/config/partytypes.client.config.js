'use strict';

// Partytypes module config
angular.module('partytypes').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Party type', 'partytypes', 'dropdown', 'partytypes(/create)?', false, ['admin']);
		Menus.addSubMenuItem('topbar', 'partytypes', 'List partytypes', 'partytypes');
		Menus.addSubMenuItem('topbar', 'partytypes', 'New partytype', 'partytypes/create');
	}
]);