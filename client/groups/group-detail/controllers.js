angular.module('pizzaDayApp')
    .controller('GroupDetailController', ['$scope', '$stateParams', '$meteor', '$rootScope',
        function ($scope, $stateParams, $meteor, $rootScope) {

            var events = $meteor.collection(Events).subscribe('events');
            //TODO add group validation
            var group_id = $stateParams.id;
            $scope.group = $meteor.object(Groups, group_id).subscribe('groups');
            $meteor.subscribe('events', group_id).then(function (subsHandler) {
                $scope.events = $meteor.collection(Events);
                $scope.current_event = $meteor.object(Events, {group: group_id, active: true});
                $meteor.subscribe('orders', $scope.current_event._id).then(function (subsHandler) {
                    $scope.order = $meteor.object(Orders, {
                        event: $scope.current_event._id,
                        user: $rootScope.currentUser._id
                    });
                }
                );
            });


            $scope.users = $meteor.collection(Meteor.users, false).subscribe('group_users', group_id);
            $scope.dishes = $meteor.collection(Dishes).subscribe('group_dishes', group_id);
            $scope.coupons = $meteor.collection(Coupons).subscribe('coupons', group_id);
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

            $scope.orderDish = function (dish) {
                var order = {
                    dish: dish,
                    event: $scope.current_event._id,
                    group: $scope.group._id
                };
                $meteor.call('orderDish', order).then(function (result) {
                        console.log('success order');
                    },
                    function (err) {
                        console.log('error order ' + err.message);
                    })
            };
            $scope.updateDishOrder = function (dish, order) {
                $meteor.call('updateDishOrder', dish._id, order._id, dish.count).then(function (result) {
                        console.log('success update dish order');
                    },
                    function (err) {
                        console.log('error update dish order ' + err.message);
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