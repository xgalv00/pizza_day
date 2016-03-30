//controllers.js
angular.module('pizzaDayApp')
    .controller('HeaderController', ['$scope', '$location', function ($scope, $location) {
        $scope.getClass = function (path) {
            var cssClass = '';
            if (path === '/'){
                cssClass = ($location.path() === path) ? 'active' : '';
            }else{
                cssClass = ($location.path().substr(0, path.length) === path) ? 'active' : '';
            }
            return cssClass;
        }
    }])
;