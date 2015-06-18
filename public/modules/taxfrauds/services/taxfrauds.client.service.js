'use strict';

//Taxfrauds service used to communicate Taxfrauds REST endpoints
angular.module('taxfrauds').factory('Taxfrauds', ['$resource',
	function($resource) {
		return $resource('taxfrauds/:taxfraudId', { taxfraudId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);