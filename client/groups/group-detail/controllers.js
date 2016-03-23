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
                $(".input-group.date").datepicker({
                    startDate: $scope.current_event.date,
                    format: 'mm-dd-yyyy'
                });
                $meteor.subscribe('orders', $scope.current_event._id).then(function (subsHandler) {
                        $scope.order = $meteor.object(Orders, {
                            event: $scope.current_event._id,
                            user: $rootScope.currentUser._id
                        });
                    }
                );
            });


            $scope.users = $meteor.collection(Meteor.users, false).subscribe('group_users', group_id);
            $scope.$meteorSubscribe('group_dishes', group_id).then(function (handle) {

                $scope.dishes = $meteor.collection(function () {
                    return Dishes.find ({});
                });

                $scope.coupon_dishes = $meteor.collection(function (handle) {
                    var coupons = Coupons.find({group: group_id});
                    var exclude_dishes = [];
                    coupons.forEach(function (element, index, iter) {
                        exclude_dishes.push(element.dish._id);
                    });
                    return Dishes.find ({group: group_id, _id: {$nin: exclude_dishes}});
                });

            });
            //$scope.dishes = $meteor.collection(Dishes).subscribe('group_dishes', group_id);
            //$scope.coupon_dishes = $meteor.collection(Dishes).subscribe('group_coupon_dishes', group_id, "test");
            $scope.coupons = $meteor.collection(Coupons).subscribe('coupons', group_id);

            $scope.addDish = function (newDish) {
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
                $meteor.call('removeCoupon', coupon).then(function (result) {
                        console.log('success remove');
                    },
                    function (err) {
                        console.log('error remove coupon' + err.message);
                    });
            };
            $scope.addCoupon = function (coupon) {
                coupon.group = group_id;
                $meteor.call('addCoupon', coupon).then(function (result) {
                        $('#addCouponModal').modal('hide');
                        console.log('success add');
                    },
                    function (err) {
                        console.log('error add coupon' + err.message);
                    });
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