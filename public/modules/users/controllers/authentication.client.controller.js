'use strict';

angular.module('users').controller('AuthenticationController', ['$scope', '$http', '$location', 'Authentication',
	function($scope, $http, $location, Authentication) {
		$scope.authentication = Authentication;

		// If user is signed in then redirect back home
		//if(typeof $scope.authentication.user.roles !== 'undefined' && typeof $scope.authentication.user.roles[0] !== 'undefined'){
			if ($scope.authentication.user &&  $scope.authentication.user.roles[0] === 'admin') $location.path('/admin/');
		//}
		if ($scope.authentication.user) $location.path('/');

		$scope.signup = function() {
			$http.post('/auth/signup', $scope.credentials).success(function(response) {
				// If successful we assign the response to the global user model
				$scope.authentication.user = response;

				// And redirect to the index page
				//if(typeof response.roles !== 'undefined' && typeof response.roles[0] !== 'undefined'){
					if ($scope.authentication.user && response.roles[0] === 'admin') {$location.path('/admin/');}
					else{$location.path('/');}
				//}
				//else{$location.path('/');}
				
			}).error(function(response) {
				$scope.error = response.message;
			});
		};

		$scope.signin = function() {
			$http.post('/auth/signin', $scope.credentials).success(function(response) {
				// If successful we assign the response to the global user model
				$scope.authentication.user = response;

				// And redirect to the index page
				// And redirect to the index page
				//if(typeof response.roles[0] !== 'undefined'){
					if ($scope.authentication.user && response.roles[0] === 'admin') {$location.path('/admin/');}
					else{$location.path('/');}
				//}
				//else{$location.path('/');}
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}


	]);