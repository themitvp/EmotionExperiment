app.controller('exampleController', function( $scope, $rootScope, $routeSegment, Page, $location) {
	$scope.Page = Page;
	$scope.$routeSegment = $routeSegment;

	$scope.hideImage = 1;
	
	$scope.showSAM = function() {
		$scope.hideImage++;
	}

	$scope.nextStep = function() {
		$location.path('/ready');
	}
});