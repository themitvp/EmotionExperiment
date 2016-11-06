app.service('storeJsonService', ['$http',
    function ($http) {
        
        this.setNewUser = function(appearance) {
            var participant = null;
			var participantId = localStorage.getItem('emotionExperiment.participantId');
			
			participantId = participantId === null ? 0 : parseInt(participantId)+1;

			localStorage.setItem('emotionExperiment.participantId', participantId);

			return $http.post("/api/newUser", { participantId: participantId, appearance: appearance });
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