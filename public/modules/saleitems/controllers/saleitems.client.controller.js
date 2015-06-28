'use strict';

// Saleitems controller
angular.module('saleitems').controller('SaleitemsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Saleitems',
	function($scope, $stateParams, $location, Authentication, Saleitems) {
		$scope.authentication = Authentication;

		// Create new Saleitem
		$scope.create = function() {
			// Create new Saleitem object
			var saleitem = new Saleitems ({
				name: this.name,
				description: this.description,
				price: this.price
			});

			// Redirect after save
			saleitem.$save(function(response) {
				$location.path('saleitems/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Saleitem
		$scope.remove = function(saleitem) {
			if ( saleitem ) { 
				saleitem.$remove();

				for (var i in $scope.saleitems) {
					if ($scope.saleitems [i] === saleitem) {
						$scope.saleitems.splice(i, 1);
					}
				}
			} else {
				$scope.saleitem.$remove(function() {
					$location.path('saleitems');
				});
			}
		};

		// Update existing Saleitem
		$scope.update = function() {
			var saleitem = $scope.saleitem;

			saleitem.$update(function() {
				$location.path('saleitems/' + saleitem._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Saleitems
		$scope.find = function() {
			Saleitems.query(function(data){
				//filtering, (should be done with a separate api endpoint idealy)
				if(Authentication.user.roles.indexOf('seller') > -1){
					$scope.saleitems = data.filter(function(element) {
						if(element.user){
							return Authentication.user._id === element.user._id;
						}
						return false;
					});
				}else{
					$scope.saleitems = data;
				}
			});		

		};

		// Find existing Saleitem
		$scope.findOne = function() {
			$scope.saleitem = Saleitems.get({ 
				saleitemId: $stateParams.saleitemId
			});
		};
	}
]);