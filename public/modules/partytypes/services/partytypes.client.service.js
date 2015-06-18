'use strict';

//Partytypes service used to communicate Partytypes REST endpoints
angular.module('partytypes').factory('Partytypes', ['$resource',
	function($resource) {
		return $resource('partytypes/:partytypeId', { partytypeId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);