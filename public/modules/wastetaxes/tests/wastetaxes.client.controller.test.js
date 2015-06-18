'use strict';

(function() {
	// Wastetaxes Controller Spec
	describe('Wastetaxes Controller Tests', function() {
		// Initialize global variables
		var WastetaxesController,
		scope,
		$httpBackend,
		$stateParams,
		$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Wastetaxes controller.
			WastetaxesController = $controller('WastetaxesController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Wastetax object fetched from XHR', inject(function(Wastetaxes) {
			// Create sample Wastetax using the Wastetaxes service
			var sampleWastetax = new Wastetaxes({
				name: 'New Wastetax'
			});

			// Create a sample Wastetaxes array that includes the new Wastetax
			var sampleWastetaxes = [sampleWastetax];

			// Set GET response
			$httpBackend.expectGET('wastetaxes').respond(sampleWastetaxes);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.wastetaxes).toEqualData(sampleWastetaxes);
		}));

		it('$scope.findOne() should create an array with one Wastetax object fetched from XHR using a wastetaxId URL parameter', inject(function(Wastetaxes) {
			// Define a sample Wastetax object
			var sampleWastetax = new Wastetaxes({
				name: 'New Wastetax'
			});

			// Set the URL parameter
			$stateParams.wastetaxId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/wastetaxes\/([0-9a-fA-F]{24})$/).respond(sampleWastetax);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.wastetax).toEqualData(sampleWastetax);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Wastetaxes) {
			// Create a sample Wastetax object
			var sampleWastetaxPostData = new Wastetaxes({
				name: 'New Wastetax'
			});

			// Create a sample Wastetax response
			var sampleWastetaxResponse = new Wastetaxes({
				_id: '525cf20451979dea2c000001',
				name: 'New Wastetax'
			});

			// Fixture mock form input values
			scope.name = 'New Wastetax';

			// Set POST response
			$httpBackend.expectPOST('wastetaxes', sampleWastetaxPostData).respond(sampleWastetaxResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Wastetax was created
			expect($location.path()).toBe('/wastetaxes/' + sampleWastetaxResponse._id);
		}));

		it('$scope.update() should update a valid Wastetax', inject(function(Wastetaxes) {
			// Define a sample Wastetax put data
			var sampleWastetaxPutData = new Wastetaxes({
				_id: '525cf20451979dea2c000001',
				name: 'New Wastetax'
			});

			// Mock Wastetax in scope
			scope.wastetax = sampleWastetaxPutData;

			// Set PUT response
			$httpBackend.expectPUT(/wastetaxes\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/wastetaxes/' + sampleWastetaxPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid wastetaxId and remove the Wastetax from the scope', inject(function(Wastetaxes) {
			// Create new Wastetax object
			var sampleWastetax = new Wastetaxes({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Wastetaxes array and include the Wastetax
			scope.wastetaxes = [sampleWastetax];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/wastetaxes\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleWastetax);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.wastetaxes.length).toBe(0);
		}));
	});
}());