'use strict';

(function() {
	// Taxfrauds Controller Spec
	describe('Taxfrauds Controller Tests', function() {
		// Initialize global variables
		var TaxfraudsController,
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

			// Initialize the Taxfrauds controller.
			TaxfraudsController = $controller('TaxfraudsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Taxfraud object fetched from XHR', inject(function(Taxfrauds) {
			// Create sample Taxfraud using the Taxfrauds service
			var sampleTaxfraud = new Taxfrauds({
				name: 'New Taxfraud'
			});

			// Create a sample Taxfrauds array that includes the new Taxfraud
			var sampleTaxfrauds = [sampleTaxfraud];

			// Set GET response
			$httpBackend.expectGET('taxfrauds').respond(sampleTaxfrauds);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.taxfrauds).toEqualData(sampleTaxfrauds);
		}));

		it('$scope.findOne() should create an array with one Taxfraud object fetched from XHR using a taxfraudId URL parameter', inject(function(Taxfrauds) {
			// Define a sample Taxfraud object
			var sampleTaxfraud = new Taxfrauds({
				name: 'New Taxfraud'
			});

			// Set the URL parameter
			$stateParams.taxfraudId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/taxfrauds\/([0-9a-fA-F]{24})$/).respond(sampleTaxfraud);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.taxfraud).toEqualData(sampleTaxfraud);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Taxfrauds) {
			// Create a sample Taxfraud object
			var sampleTaxfraudPostData = new Taxfrauds({
				name: 'New Taxfraud'
			});

			// Create a sample Taxfraud response
			var sampleTaxfraudResponse = new Taxfrauds({
				_id: '525cf20451979dea2c000001',
				name: 'New Taxfraud'
			});

			// Fixture mock form input values
			scope.name = 'New Taxfraud';

			// Set POST response
			$httpBackend.expectPOST('taxfrauds', sampleTaxfraudPostData).respond(sampleTaxfraudResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Taxfraud was created
			expect($location.path()).toBe('/taxfrauds/' + sampleTaxfraudResponse._id);
		}));

		it('$scope.update() should update a valid Taxfraud', inject(function(Taxfrauds) {
			// Define a sample Taxfraud put data
			var sampleTaxfraudPutData = new Taxfrauds({
				_id: '525cf20451979dea2c000001',
				name: 'New Taxfraud'
			});

			// Mock Taxfraud in scope
			scope.taxfraud = sampleTaxfraudPutData;

			// Set PUT response
			$httpBackend.expectPUT(/taxfrauds\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/taxfrauds/' + sampleTaxfraudPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid taxfraudId and remove the Taxfraud from the scope', inject(function(Taxfrauds) {
			// Create new Taxfraud object
			var sampleTaxfraud = new Taxfrauds({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Taxfrauds array and include the Taxfraud
			scope.taxfrauds = [sampleTaxfraud];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/taxfrauds\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleTaxfraud);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.taxfrauds.length).toBe(0);
		}));
	});
}());