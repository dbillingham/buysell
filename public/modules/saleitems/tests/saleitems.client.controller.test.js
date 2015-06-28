'use strict';

(function() {
	// Saleitems Controller Spec
	describe('Saleitems Controller Tests', function() {
		// Initialize global variables
		var SaleitemsController,
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

			// Initialize the Saleitems controller.
			SaleitemsController = $controller('SaleitemsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Saleitem object fetched from XHR', inject(function(Saleitems) {
			// Create sample Saleitem using the Saleitems service
			var sampleSaleitem = new Saleitems({
				name: 'New Saleitem'
			});

			// Create a sample Saleitems array that includes the new Saleitem
			var sampleSaleitems = [sampleSaleitem];

			// Set GET response
			$httpBackend.expectGET('saleitems').respond(sampleSaleitems);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.saleitems).toEqualData(sampleSaleitems);
		}));

		it('$scope.findOne() should create an array with one Saleitem object fetched from XHR using a saleitemId URL parameter', inject(function(Saleitems) {
			// Define a sample Saleitem object
			var sampleSaleitem = new Saleitems({
				name: 'New Saleitem'
			});

			// Set the URL parameter
			$stateParams.saleitemId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/saleitems\/([0-9a-fA-F]{24})$/).respond(sampleSaleitem);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.saleitem).toEqualData(sampleSaleitem);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Saleitems) {
			// Create a sample Saleitem object
			var sampleSaleitemPostData = new Saleitems({
				name: 'New Saleitem'
			});

			// Create a sample Saleitem response
			var sampleSaleitemResponse = new Saleitems({
				_id: '525cf20451979dea2c000001',
				name: 'New Saleitem'
			});

			// Fixture mock form input values
			scope.name = 'New Saleitem';

			// Set POST response
			$httpBackend.expectPOST('saleitems', sampleSaleitemPostData).respond(sampleSaleitemResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Saleitem was created
			expect($location.path()).toBe('/saleitems/' + sampleSaleitemResponse._id);
		}));

		it('$scope.update() should update a valid Saleitem', inject(function(Saleitems) {
			// Define a sample Saleitem put data
			var sampleSaleitemPutData = new Saleitems({
				_id: '525cf20451979dea2c000001',
				name: 'New Saleitem'
			});

			// Mock Saleitem in scope
			scope.saleitem = sampleSaleitemPutData;

			// Set PUT response
			$httpBackend.expectPUT(/saleitems\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/saleitems/' + sampleSaleitemPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid saleitemId and remove the Saleitem from the scope', inject(function(Saleitems) {
			// Create new Saleitem object
			var sampleSaleitem = new Saleitems({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Saleitems array and include the Saleitem
			scope.saleitems = [sampleSaleitem];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/saleitems\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleSaleitem);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.saleitems.length).toBe(0);
		}));
	});
}());