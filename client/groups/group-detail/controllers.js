angular.module('pizzaDayApp')
    .controller('GroupDetailController', ['$scope', '$stateParams', '$meteor', '$rootScope',
        function ($scope, $stateParams, $meteor, $rootScope) {

            var events = $meteor.collection(Events).subscribe('events');
            //TODO add group validation
            var group_id = $stateParams.id;
            $scope.group = $meteor.object(Groups, group_id).subscribe('groups');
            //TODO rewrite with fetch one item from db
            $scope.events = $meteor.collection(Events).subscribe('events');
            $scope.users = $meteor.collection(Meteor.users, false).subscribe('group_users');
            $scope.dishes = $meteor.collection(Dishes).subscribe('group_dishes', group_id);
            $scope.coupons = $meteor.collection(Coupons).subscribe('coupons');
            $scope.images = $meteor.collectionFS(Images, false, Images).subscribe('images');

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

            $scope.addDish = function (newDish) {
                if ($scope.myCroppedImage !== '') {
                    $scope.images.save($scope.myCroppedImage).then(function (result) {
                        newDish.image = result[0]._id;
                        newDish.group = $scope.group._id;
                        newDish.owner = $rootScope.currentUser._id;
                        $meteor.call('addDish', newDish).then(
                            function (result) {
                                $scope.imgSrc = undefined;
                                $scope.myCroppedImage = '';
                                $('#addDishModal').modal('hide');
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

            $scope.removeDish = function (dish) {
                $meteor.call('removeDish', dish).then(function (result) {
                        console.log('success remove');
                    },
                    function (err) {
                        console.log('error remove' + err.message);
                    })
            };

            $scope.removeCoupon = function (coupon) {
                $scope.coupons.remove(coupon);
            };
            $scope.addCoupon = function (coupon) {
                $scope.coupons.save(coupon);
                $('#addCouponModal').modal('hide');
                //    TODO add server side validation
            };

            $scope.addEvent = function (event) {
                event.group = $scope.group._id;
                $meteor.call('addEvent', event).then(function (result) {
                     $('#addEventModal').modal('hide');
                        console.log('success add event');
                    },
                    function (err) {
                        console.log('error add event' + err.message);
                    });
            };
            $scope.removeEvent = function (event) {
                $scope.events.remove(event);
            };

        }
    ])
    .controller('ModalInstanceCtrl', ['$scope', '$meteor', '$modalInstance', 'group', function ($scope, $meteor, $modalInstance, group) {
        $scope.group = group;
        $scope.editGroup = function (group) {
            console.log(group.name + 'from modal instance');
        }
    }])
;