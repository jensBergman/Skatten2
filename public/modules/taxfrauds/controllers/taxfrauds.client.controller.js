'use strict';

// Taxfrauds controller
angular.module('taxfrauds').controller('TaxfraudsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Taxfrauds',
	function($scope, $stateParams, $location, Authentication, Taxfrauds) {
		$scope.authentication = Authentication;

		// Create new Taxfraud
		$scope.create = function() {
			// Create new Taxfraud object
			var taxfraud = new Taxfrauds ({
				name: this.name
			});

			// Redirect after save
			taxfraud.$save(function(response) {
				$location.path('taxfrauds/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Taxfraud
		$scope.remove = function(taxfraud) {
			if ( taxfraud ) { 
				taxfraud.$remove();

				for (var i in $scope.taxfrauds) {
					if ($scope.taxfrauds [i] === taxfraud) {
						$scope.taxfrauds.splice(i, 1);
					}
				}
			} else {
				$scope.taxfraud.$remove(function() {
					$location.path('taxfrauds');
				});
			}
		};

		// Update existing Taxfraud
		$scope.update = function() {
			var taxfraud = $scope.taxfraud;

			taxfraud.$update(function() {
				$location.path('taxfrauds/' + taxfraud._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Taxfrauds
		$scope.find = function() {
			$scope.taxfrauds = Taxfrauds.query();
		};

		// Find existing Taxfraud
		$scope.findOne = function() {
			$scope.taxfraud = Taxfrauds.get({ 
				taxfraudId: $stateParams.taxfraudId
			});
		};
	}
]);