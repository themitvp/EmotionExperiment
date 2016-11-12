app.controller('startController', function( $scope, $rootScope, $http, $location, $window, $routeSegment, Page, imagesService, $timeout, storeJsonService ) {
	$scope.Page = Page;
	$scope.$routeSegment = $routeSegment;
	$scope.images = null;
	$scope.currentImage = null;
	$scope.currentImageIndex = 0;
	$scope.currentValence = null;
	$scope.currentArousal = null;
	$scope.currentFace = {};

	var maskeDuration = 500; // How long the mask is shown
	
	var recordFace = false;
	
	imagesService.getImages().then(function() {
		$scope.images = csvJSON(imagesService.images);
		$scope.currentImage = $scope.images[0];
		$location.path('/start/' + $scope.currentImageIndex);
		addNewImageTracking();
	});

	$rootScope.detector.addEventListener("onImageResultsSuccess", function(faces, image, timestamp) {
		if (faces.length > 0 && recordFace) {

			$scope.currentFace.inputs.push({
				timestamp: timestamp,
				emotions: faces[0].emotions,
                //expressions: faces[0].expressions
            });
		}
	});

	function addNewImageTracking() {
		$scope.currentFace = {
			imageName: $scope.currentImage.Image,
			trueValence: $scope.currentImage.Valence,
			trueArousal: $scope.currentImage.Arousal,
			inputs: []
		};
		recordFace = false;
	}

	$rootScope.$on('lazyImg:success', function(event, data) {  
		recordFace = true;
		$scope.showNoise($scope.currentImage.Time);
	});

	$scope.showNoise = function(time) {	
		$timeout(function () {
			//recordFace = false;
			$location.path('/start/' + $scope.currentImageIndex + '/noise');
			$scope.showSAM(maskeDuration);
		}, time);
	}

	$scope.showSAM = function(time) {
		$timeout(function () {
			$location.path('/start/' + $scope.currentImageIndex + '/sam');
		}, time);
	}

	$scope.nextImage = function() {

		$scope.currentFace.samValence = $scope.currentValence;
		$scope.currentFace.samArousal = $scope.currentArousal;

		storeJsonService.setImageUserData($scope.currentFace).then(function() {
			//data is send
		});

		$scope.currentValence = null;
		$scope.currentArousal = null;

		if ($scope.currentImageIndex < $scope.images.length - 1) {
			$scope.currentImageIndex += 1;
			$scope.currentImage = $scope.images[$scope.currentImageIndex];
			$location.path('/start/' + $scope.currentImageIndex);
			addNewImageTracking();
		} else {
			alert("Thank you for your participation :) \nHave a great day");
			$window.location.href = '/welcome';
		}
	};

	//var csv is the CSV file with headers
	function csvJSON(csv){
		var lines=csv.split("\n");

		var result = [];

		var headers=lines[0].split("\t");

		for(var i=1;i<lines.length;i++){

			var obj = {};
			var currentline=lines[i].split("\t");

			for(var j=0;j<headers.length;j++){
				obj[headers[j]] = currentline[j];
			}

			result.push(obj);
		}

		return result;
	}
});