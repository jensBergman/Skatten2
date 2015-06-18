'use strict';

//Politicians service used to communicate Politicians REST endpoints
angular.module('politicians').factory('Politicians', ['$resource',
	function($resource) {
		return $resource('politicians/:politicianId', { politicianId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);