app.controller('welcomeController', function( $scope, $rootScope, $http, $location, $routeSegment, Page ) {
	$scope.Page = Page;
	$scope.$routeSegment = $routeSegment;

	$scope.startAffdex = function() {
		$rootScope.onStart();
	};


	/*$scope.$watch('noNetwork',function(newValue){
	//Handle your tasks here.
	});*/
});