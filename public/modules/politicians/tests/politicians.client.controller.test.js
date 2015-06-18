'use strict';

(function() {
	// Politicians Controller Spec
	describe('Politicians Controller Tests', function() {
		// Initialize global variables
		var PoliticiansController,
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

			// Initialize the Politicians controller.
			PoliticiansController = $controller('PoliticiansController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Politician object fetched from XHR', inject(function(Politicians) {
			// Create sample Politician using the Politicians service
			var samplePolitician = new Politicians({
				name: 'New Politician'
			});

			// Create a sample Politicians array that includes the new Politician
			var samplePoliticians = [samplePolitician];

			// Set GET response
			$httpBackend.expectGET('politicians').respond(samplePoliticians);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.politicians).toEqualData(samplePoliticians);
		}));

		it('$scope.findOne() should create an array with one Politician object fetched from XHR using a politicianId URL parameter', inject(function(Politicians) {
			// Define a sample Politician object
			var samplePolitician = new Politicians({
				name: 'New Politician'
			});

			// Set the URL parameter
			$stateParams.politicianId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/politicians\/([0-9a-fA-F]{24})$/).respond(samplePolitician);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.politician).toEqualData(samplePolitician);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Politicians) {
			// Create a sample Politician object
			var samplePoliticianPostData = new Politicians({
				name: 'New Politician'
			});

			// Create a sample Politician response
			var samplePoliticianResponse = new Politicians({
				_id: '525cf20451979dea2c000001',
				name: 'New Politician'
			});

			// Fixture mock form input values
			scope.name = 'New Politician';

			// Set POST response
			$httpBackend.expectPOST('politicians', samplePoliticianPostData).respond(samplePoliticianResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Politician was created
			expect($location.path()).toBe('/politicians/' + samplePoliticianResponse._id);
		}));

		it('$scope.update() should update a valid Politician', inject(function(Politicians) {
			// Define a sample Politician put data
			var samplePoliticianPutData = new Politicians({
				_id: '525cf20451979dea2c000001',
				name: 'New Politician'
			});

			// Mock Politician in scope
			scope.politician = samplePoliticianPutData;

			// Set PUT response
			$httpBackend.expectPUT(/politicians\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/politicians/' + samplePoliticianPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid politicianId and remove the Politician from the scope', inject(function(Politicians) {
			// Create new Politician object
			var samplePolitician = new Politicians({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Politicians array and include the Politician
			scope.politicians = [samplePolitician];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/politicians\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(samplePolitician);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.politicians.length).toBe(0);
		}));
	});
}());