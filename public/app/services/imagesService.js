app.service('imagesService', ['$http',
    function ($http) {
        var url = 'assets/img/GAPED/images.txt';
        this.images;
        this.data;

        this.getImages = function() {
            return $http.get(url).then(function(data) {
                this.images = data.data
            }.bind(this));
        };
    }
]);