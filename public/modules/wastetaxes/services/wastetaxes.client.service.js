'use strict';

//Wastetaxes service used to communicate Wastetaxes REST endpoints
angular.module('wastetaxes').factory('Wastetaxes', ['$resource',
	function($resource) {
		return $resource('wastetaxes/:wastetaxId', { wastetaxId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);