'use strict';

// Politicians controller
angular.module('politicians').controller('PoliticiansController', ['$scope', '$stateParams', '$location', 'Authentication', 'Politicians',
	function($scope, $stateParams, $location, Authentication, Politicians) {
		$scope.authentication = Authentication;

		// Create new Politician
		$scope.create = function() {
			// Create new Politician object
			var politician = new Politicians ({
				name: this.name
			});

			// Redirect after save
			politician.$save(function(response) {
				$location.path('politicians/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Politician
		$scope.remove = function(politician) {
			if ( politician ) { 
				politician.$remove();

				for (var i in $scope.politicians) {
					if ($scope.politicians [i] === politician) {
						$scope.politicians.splice(i, 1);
					}
				}
			} else {
				$scope.politician.$remove(function() {
					$location.path('politicians');
				});
			}
		};

		// Update existing Politician
		$scope.update = function() {
			var politician = $scope.politician;

			politician.$update(function() {
				$location.path('politicians/' + politician._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Politicians
		$scope.find = function() {
			$scope.politicians = Politicians.query();
		};

		// Find existing Politician
		$scope.findOne = function() {
			$scope.politician = Politicians.get({ 
				politicianId: $stateParams.politicianId
			});
		};
	}
]);