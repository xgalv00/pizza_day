angular.module('pizzaDayApp')
    .controller('GroupListController', ['$scope', '$rootScope', 'groupListFactory', function ($scope, $rootScope, groupListFactory) {
        $scope.groups = groupListFactory.getGroups();
        $scope.images = groupListFactory.getImages();

        $scope.addImages = function (files) {
            if (files.length > 0) {
                var reader = new FileReader();

                reader.onload = function (e) {
                    $scope.$apply(function () {
                        $scope.imgSrc = e.target.result;
                        $scope.myCroppedImage = '';
                    });
                };

                reader.readAsDataURL(files[0]);
            }
            else {
                $scope.imgSrc = undefined;
            }
        };

        $scope.addGroup = function (newGroup) {
            if ($scope.myCroppedImage !== '') {
                debugger;
                $scope.images.save($scope.myCroppedImage).then(function (result) {

                    newGroup.image = result[0]._id._id;
                    newGroup.owner = $rootScope.currentUser._id;
                    $scope.groups.save(newGroup);
                    $scope.imgSrc = undefined;
                    $scope.myCroppedImage = '';
                }, function (err) {
                    // an error occurred while saving the todos: maybe you're not authorized
                    console.error('An error occurred. The error message is: ' + err.message);
                });

            } else {
                console.log('error cropping')
            }
        }
    }]);