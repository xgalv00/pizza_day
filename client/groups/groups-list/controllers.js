angular.module('pizzaDayApp')
    .controller('GroupListController', ['$scope', '$rootScope', '$meteor', '$modal', function ($scope, $rootScope, $meteor, $modal) {
        $scope.groups = $meteor.collection(Groups).subscribe('groups');
        $scope.images = $meteor.collectionFS(Images, false, Images).subscribe('images');

        $scope.open = function (_group) {

            var modalInstance = $modal.open({
                controller: "ModalInstanceCtrl",
                templateUrl: 'editModalContent.html',
                resolve: {
                    group: function () {
                        return _group;
                    }
                }
            });

        };

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
                $scope.images.save($scope.myCroppedImage).then(function (result) {
                    newGroup.image = result[0]._id;
                    newGroup.owner = $rootScope.currentUser._id;
                    $meteor.call('addGroup', newGroup).then(
                        function (result) {
                            $scope.imgSrc = undefined;
                            $scope.myCroppedImage = '';
                            $('#addGroupModal').modal('hide');
                        },
                        function (err) {
                            console.log('failed', err);
                        }
                    );
                    //$scope.groups.save(newGroup);

                }, function (err) {
                    // an error occurred while saving the todos: maybe you're not authorized
                    console.error('An error occurred. The error message is: ' + err.message);
                });

            } else {
                console.log('error cropping')
            }
        };

        $scope.removeGroup = function (group) {
            $meteor.call('removeGroup', group).then(function (result) {
                    console.log('success remove');
                },
                function (err) {
                    console.log('error remove' + err.message);
                })
        };
    }])
    .controller('ModalInstanceCtrl', ['$scope', '$meteor', '$modalInstance', 'group', function ($scope, $meteor, $modalInstance, group) {
        $scope.group = group;
        $scope.editGroup = function (group) {
            console.log(group.name + 'from modal instance');
        }
    }])
;