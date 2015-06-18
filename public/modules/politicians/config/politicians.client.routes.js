'use strict';

//Setting up route
angular.module('politicians').config(['$stateProvider',
	function($stateProvider) {
		// Politicians state routing
		$stateProvider.
		state('listPoliticians', {
			url: '/politicians',
			templateUrl: 'modules/politicians/views/list-politicians.client.view.html'
		}).
		state('createPolitician', {
			url: '/politicians/create',
			templateUrl: 'modules/politicians/views/create-politician.client.view.html'
		}).
		state('viewPolitician', {
			url: '/politicians/:politicianId',
			templateUrl: 'modules/politicians/views/view-politician.client.view.html'
		}).
		state('editPolitician', {
			url: '/politicians/:politicianId/edit',
			templateUrl: 'modules/politicians/views/edit-politician.client.view.html'
		});
	}
]);