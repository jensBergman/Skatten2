'use strict';

//Setting up route
angular.module('wastetaxes').config(['$stateProvider',
	function($stateProvider) {
		// Wastetaxes state routing
		$stateProvider.
		state('listWastetaxes', {
			url: '/wastetaxes',
			templateUrl: 'modules/wastetaxes/views/list-wastetaxes.client.view.html'
		}).
		state('createWastetax', {
			url: '/wastetaxes/create',
			templateUrl: 'modules/wastetaxes/views/create-wastetax.client.view.html'
		}).
		state('viewWastetax', {
			url: '/wastetaxes/:wastetaxId',
			templateUrl: 'modules/wastetaxes/views/view-wastetax.client.view.html'
		}).
		state('editWastetax', {
			url: '/wastetaxes/:wastetaxId/edit',
			templateUrl: 'modules/wastetaxes/views/edit-wastetax.client.view.html'
		});
	}
]);