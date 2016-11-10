app.controller('readyController', function( $scope, $rootScope, $http, $location, $routeSegment, Page, storeJsonService ) {
	$scope.Page = Page;
	$scope.$routeSegment = $routeSegment;

	$scope.startExample = function() {
		$location.path('/example');
	};

	$scope.startExperiment = function() {
		storeJsonService.setNewUser($rootScope.appearance);
		$location.path('/start');
	};
});