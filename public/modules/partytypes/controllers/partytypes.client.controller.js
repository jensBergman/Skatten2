'use strict';

// Partytypes controller
angular.module('partytypes').controller('PartytypesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Partytypes',
	function($scope, $stateParams, $location, Authentication, Partytypes) {
		$scope.authentication = Authentication;
		$scope.currentPage = 1;
		$scope.pageSize = 10;
		$scope.offset = 0;

		$scope.tabs = [
			{ title:'Riksdag', content:'Riksdag' },
			{ title:'Landsting', content:'Landsting'},
			{ title:'Kommun', content:'Kommun'}
		];

		$scope.options = [
			{ value: 'Riksdag', name: 'Riksdag' },
			 { value: 'Landsting', name: 'Landsting' },
			 { value: 'Kommun', name: 'Kommun' },
		];
		$scope.selectedOption = $scope.options[0];

		// page changed handler
		$scope.pageChanged = function(){
			$scope.offset = ($scope.currentPage -1) * $scope.pageSize;
		};

		// search for a location
		$scope.partytypeSearch = function(partytype){
			$location.path('partytypes/' + partytype._id);
		};

		// Create new Partytype
		$scope.create = function() {
			// Create new Partytype object
			var partytype = new Partytypes ({
				area: this.selectedOption.value,
				location: this.location
			});

			// Redirect after save
			partytype.$save(function(response) {
				$location.path('partytypes/' + response._id);

				// Clear form fields
				$scope.area = '';
				$scope.location = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Partytype
		$scope.remove = function(partytype) {
			if ( partytype ) { 
				partytype.$remove();

				for (var i in $scope.partytypes) {
					if ($scope.partytypes [i] === partytype) {
						$scope.partytypes.splice(i, 1);
					}
				}
			} else {
				$scope.partytype.$remove(function() {
					$location.path('partytypes');
				});
			}
		};

		// Update existing Partytype
		$scope.update = function() {
			var partytype = $scope.partytype;
			partytype.area = this.selectedOption.value;

			partytype.$update(function() {
				$location.path('partytypes/' + partytype._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Partytypes
		$scope.find = function() {
			$scope.partytypes = Partytypes.query();
		};

		// Find existing Partytype
		$scope.findOne = function() {
			$scope.partytype = Partytypes.get({ 
				partytypeId: $stateParams.partytypeId
			});
		};
	}
	]);