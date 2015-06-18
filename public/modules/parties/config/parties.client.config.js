'use strict';

// Configuring the Articles module
angular.module('parties').run(['Menus',
    function(Menus) {
        // Set top bar menu items
        Menus.addMenuItem('topbar', 'Parties', 'parties', 'dropdown', '/parties(/create)?', false, ['admin']);
        Menus.addSubMenuItem('topbar', 'parties', 'List parties', 'parties');
        Menus.addSubMenuItem('topbar', 'parties', 'New party', 'parties/create');
    }
]);