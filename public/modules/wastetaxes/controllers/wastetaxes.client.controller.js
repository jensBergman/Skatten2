'use strict';

// Wastetaxes controller
angular.module('wastetaxes').controller('WastetaxesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Wastetaxes',
	function($scope, $stateParams, $location, Authentication, Wastetaxes) {
		$scope.authentication = Authentication;

		// Create new Wastetax
		$scope.create = function() {
			// Create new Wastetax object
			var wastetax = new Wastetaxes ({
				name: this.name
			});

			// Redirect after save
			wastetax.$save(function(response) {
				$location.path('wastetaxes/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Wastetax
		$scope.remove = function(wastetax) {
			if ( wastetax ) { 
				wastetax.$remove();

				for (var i in $scope.wastetaxes) {
					if ($scope.wastetaxes [i] === wastetax) {
						$scope.wastetaxes.splice(i, 1);
					}
				}
			} else {
				$scope.wastetax.$remove(function() {
					$location.path('wastetaxes');
				});
			}
		};

		// Update existing Wastetax
		$scope.update = function() {
			var wastetax = $scope.wastetax;

			wastetax.$update(function() {
				$location.path('wastetaxes/' + wastetax._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Wastetaxes
		$scope.find = function() {
			$scope.wastetaxes = Wastetaxes.query();
		};

		// Find existing Wastetax
		$scope.findOne = function() {
			$scope.wastetax = Wastetaxes.get({ 
				wastetaxId: $stateParams.wastetaxId
			});
		};
	}
]);