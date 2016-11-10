var app = angular.module('emotionApp', ['ngRoute', 'route-segment', 'view-segment', 'ngAnimate', 'ngSanitize', 'ngResource', 'angular-loading-bar', 'ui.bootstrap']);

var resolve = {
    delay: function ($q, $timeout) {
        var delay = $q.defer();
        $timeout(delay.resolve, 0, false);
        return delay.promise;
    }
};

app.factory('Page', function () {
    var title = 'Emotion Experiment';
    return {
        title: function () {
            return title;
        },
        setTitle: function (newTitle) {
            title = newTitle + " | Emotion Experiment";
        }
    };
});

// configure our routes
app.config(function ($routeSegmentProvider, $locationProvider, $routeProvider) {
    $locationProvider.html5Mode(true);
    $routeSegmentProvider.options.autoLoadTemplates = true;

    $routeSegmentProvider.otherwise = function (route) {
        $routeProvider.otherwise({redirectTo: route});
        return this;
    };


    $routeSegmentProvider

    .when('/', 'welcome')
    .when('/ready', 'ready')
    .when('/example', 'example')
    .when('/start', 'start')
    .when('/start/:imageId', 'start.image')
    .when('/start/:imageId/noise', 'start.noise')
    .when('/start/:imageId/sam', 'start.sam')
    .otherwise('/')

    .segment('welcome', {
        default: true,
        templateUrl: 'app/views/welcome.html?1',
        controller: 'welcomeController'
    })

    .segment('ready', {
        templateUrl: 'app/views/ready.html?1',
        controller: 'readyController'
    })

    .segment('example', {
        templateUrl: 'app/views/example.html?1',
        controller: 'exampleController'
    })

    .segment('start', {
        templateUrl: 'app/views/start.html?1',
        controller: 'startController'
    })

    .within()

    .segment('image', {
        templateUrl: 'app/views/image.html?1',
        dependencies: ['imageId'],
        resolve: resolve
    })

    .segment('noise', {
        templateUrl: 'app/views/noise.html?1'
    })

    .segment('sam', {
        templateUrl: 'app/views/sam.html?1'
    });
});

app.run(function ($rootScope, $location, $timeout) {
    var divRoot = $("#affdex_elements")[0];
    var width = 640;
    var height = 480;
    var faceMode = affdex.FaceDetectorMode.LARGE_FACES;
    //Construct a CameraDetector and specify the image width / height and face detector mode.
    $rootScope.detector = new affdex.CameraDetector(divRoot, width, height, faceMode);
    $rootScope.progressStatus = 0;

    //Enable detection of all Expressions, Emotions and Emojis classifiers.
    $rootScope.detector.detectAllEmotions();
    $rootScope.detector.detectAllExpressions();
    $rootScope.detector.detectAllAppearance();

    //function executes when Start button is pushed.
    $rootScope.onStart = function() {
        if ($rootScope.detector && !$rootScope.detector.isRunning) {
            $rootScope.detector.start();
            $rootScope.progressStatus = 25;
        }
        console.log("log: Clicked the start button");
    }

    //function executes when the Stop button is pushed.
    $rootScope.onStop = function() {
        console.log("log: Clicked the stop button");
        if ($rootScope.detector && $rootScope.detector.isRunning) {
            $rootScope.detector.removeEventListener();
            $rootScope.detector.stop();
        }
    };

    //function executes when the Reset button is pushed.
    $rootScope.onReset = function() {
        console.log("log: Clicked the reset button");
        if ($rootScope.detector && $rootScope.detector.isRunning) {
            $rootScope.detector.reset();
        }
    };

    //Add a callback to notify when camera access is allowed
    $rootScope.detector.addEventListener("onWebcamConnectSuccess", function() {
        console.log("log: Webcam access allowed");
        $rootScope.updateProgress(50);
    });

    //Add a callback to notify when camera access is denied
    $rootScope.detector.addEventListener("onWebcamConnectFailure", function() {
        console.log("log: webcam denied");
    });

    //Add a callback to notify when detector is stopped
    $rootScope.detector.addEventListener("onStopSuccess", function() {
        console.log("log: The detector reports stopped");
    });

    //Add a callback to notify when the detector is initialized and ready for runing.
    $rootScope.detector.addEventListener("onInitializeSuccess", function() {
        console.log("log: The detector reports initialized");
        //Display canvas instead of video feed because we want to draw the feature points on it
        $("#face_video_canvas").css("display", "block");
        $("#face_video").css("display", "none");
        $rootScope.updateProgress(75);
    });

    var waitForFace = true;
    $rootScope.appearance = {};

    $rootScope.detector.addEventListener("onImageResultsSuccess", function(faces, image, timestamp) {
        if (faces.length > 0 && waitForFace) {
            if (faces[0].appearance.age !== "Unknown" && faces[0].appearance.ethnicity !== "Unknown" && faces[0].appearance.gender !== "Unknown") {
                console.log("log: The face has been found");
                $rootScope.$apply(function(){
                    $rootScope.appearance = faces[0].appearance;
                });              
                waitForFace = false;
                $rootScope.updateProgress(100);

                $timeout(function(){
                    $location.path('/ready');
                }, 1000);
            }
        }
    });

    $rootScope.updateProgress = function(value) {
        $rootScope.$apply(function(){
            $rootScope.progressStatus = value;
        });
    };
});