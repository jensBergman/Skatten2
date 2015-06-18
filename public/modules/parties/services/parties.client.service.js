'use strict';

//Parties service used to communicate Parties REST endpoints
angular.module('parties').factory('Parties', ['$resource',
	function($resource) {
		return $resource('parties/:partyId', { partyId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);