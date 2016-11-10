app.service('storeJsonService', ['$http',
    function ($http) {
        
        this.setNewUser = function(appearance) {
        	return $http.post("/api/newUser", { appearance: appearance }).then(function(response) {
				
				var participantId = response.data.name;

				localStorage.setItem('emotionExperiment.participantId', participantId);
        	});
        };

        this.setImageUserData = function(data) {
        	var participantId = localStorage.getItem('emotionExperiment.participantId');
        	data.participantId = participantId;

        	return $http.post("/api/saveNewImage", data);

        }

        this.getUser = function() {
        	return parseInt(localStorage.getItem('emotionExperiment.participantId'));
        }

    }
]);