'use strict';

angular.module('parties').controller('PartiesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Parties',
	function($scope, $stateParams, $location, Authentication, Parties) {
	$scope.authentication = Authentication;
		$scope.currentPage = 1;
		$scope.pageSize = 10;
		$scope.offset = 0;

		$scope.tabs = [
			{ title:'Aliansen', content:'Aliansen' },
			{ title:'Rödgröna', content:'Rödgröna'},
			{ title:'Inget block', content:'none'}
		];

		$scope.options = [
			{ value: 'Aliansen', name: 'Aliansen' },
			 { value: 'Rödgröna', name: 'Rödgröna' },
			 { value: 'none', name: 'Inget parti' },
		];
		$scope.selectedOption = $scope.options[2];

		// page changed handler
		$scope.pageChanged = function(){
			$scope.offset = ($scope.currentPage -1) * $scope.pageSize;
		};

		// search for a location
		$scope.partiesSearch = function(party){
			$location.path('parties/' + party._id);
		};

		// Create new party
		$scope.create = function() {
			// Create new party object
			var party = new Parties ({
				name: this.name,
				block: this.selectedOption.value
			});

			// Redirect after save
			party.$save(function(response) {
				$location.path('parties/' + response._id);

				// Clear form fields
				$scope.name = '';
				$scope.block = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing party
		$scope.remove = function(party) {
			if ( party ) { 
				party.$remove();

				for (var i in $scope.parties) {
					if ($scope.parties [i] === party) {
						$scope.parties.splice(i, 1);
					}
				}
			} else {
				$scope.party.$remove(function() {
					$location.path('parties');
				});
			}
		};

		// Update existing party
		$scope.update = function() {
			var party = $scope.party;
			party.block = this.selectedOption.value;

			party.$update(function() {
				$location.path('parties/' + party._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of parties
		$scope.find = function() {
			$scope.parties = Parties.query();
		};

		// Find existing party
		$scope.findOne = function() {
			$scope.party = Parties.get({ 
				partyId: $stateParams.partyId
			});
		};
	}
]);