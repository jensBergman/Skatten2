'use strict';

//Setting up route
angular.module('partytypes').config(['$stateProvider',
	function($stateProvider) {
		// Partytypes state routing
		$stateProvider.
		state('listPartytypes', {
			url: '/partytypes',
			templateUrl: 'modules/partytypes/views/list-partytypes.client.view.html'
		}).
		state('createPartytype', {
			url: '/partytypes/create',
			templateUrl: 'modules/partytypes/views/create-partytype.client.view.html'
		}).
		state('viewPartytype', {
			url: '/partytypes/:partytypeId',
			templateUrl: 'modules/partytypes/views/view-partytype.client.view.html'
		}).
		state('editPartytype', {
			url: '/partytypes/:partytypeId/edit',
			templateUrl: 'modules/partytypes/views/edit-partytype.client.view.html'
		});
	}
]);