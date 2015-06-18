'use strict';

//Setting up route
angular.module('taxfrauds').config(['$stateProvider',
	function($stateProvider) {
		// Taxfrauds state routing
		$stateProvider.
		state('listTaxfrauds', {
			url: '/taxfrauds',
			templateUrl: 'modules/taxfrauds/views/list-taxfrauds.client.view.html'
		}).
		state('createTaxfraud', {
			url: '/taxfrauds/create',
			templateUrl: 'modules/taxfrauds/views/create-taxfraud.client.view.html'
		}).
		state('viewTaxfraud', {
			url: '/taxfrauds/:taxfraudId',
			templateUrl: 'modules/taxfrauds/views/view-taxfraud.client.view.html'
		}).
		state('editTaxfraud', {
			url: '/taxfrauds/:taxfraudId/edit',
			templateUrl: 'modules/taxfrauds/views/edit-taxfraud.client.view.html'
		});
	}
]);