'use strict';

(function() {
	// Partytypes Controller Spec
	describe('Partytypes Controller Tests', function() {
		// Initialize global variables
		var PartytypesController,
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

			// Initialize the Partytypes controller.
			PartytypesController = $controller('PartytypesController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Partytype object fetched from XHR', inject(function(Partytypes) {
			// Create sample Partytype using the Partytypes service
			var samplePartytype = new Partytypes({
				name: 'New Partytype'
			});

			// Create a sample Partytypes array that includes the new Partytype
			var samplePartytypes = [samplePartytype];

			// Set GET response
			$httpBackend.expectGET('partytypes').respond(samplePartytypes);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.partytypes).toEqualData(samplePartytypes);
		}));

		it('$scope.findOne() should create an array with one Partytype object fetched from XHR using a partytypeId URL parameter', inject(function(Partytypes) {
			// Define a sample Partytype object
			var samplePartytype = new Partytypes({
				name: 'New Partytype'
			});

			// Set the URL parameter
			$stateParams.partytypeId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/partytypes\/([0-9a-fA-F]{24})$/).respond(samplePartytype);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.partytype).toEqualData(samplePartytype);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Partytypes) {
			// Create a sample Partytype object
			var samplePartytypePostData = new Partytypes({
				name: 'New Partytype'
			});

			// Create a sample Partytype response
			var samplePartytypeResponse = new Partytypes({
				_id: '525cf20451979dea2c000001',
				name: 'New Partytype'
			});

			// Fixture mock form input values
			scope.name = 'New Partytype';

			// Set POST response
			$httpBackend.expectPOST('partytypes', samplePartytypePostData).respond(samplePartytypeResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Partytype was created
			expect($location.path()).toBe('/partytypes/' + samplePartytypeResponse._id);
		}));

		it('$scope.update() should update a valid Partytype', inject(function(Partytypes) {
			// Define a sample Partytype put data
			var samplePartytypePutData = new Partytypes({
				_id: '525cf20451979dea2c000001',
				name: 'New Partytype'
			});

			// Mock Partytype in scope
			scope.partytype = samplePartytypePutData;

			// Set PUT response
			$httpBackend.expectPUT(/partytypes\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/partytypes/' + samplePartytypePutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid partytypeId and remove the Partytype from the scope', inject(function(Partytypes) {
			// Create new Partytype object
			var samplePartytype = new Partytypes({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Partytypes array and include the Partytype
			scope.partytypes = [samplePartytype];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/partytypes\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(samplePartytype);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.partytypes.length).toBe(0);
		}));
	});
}());