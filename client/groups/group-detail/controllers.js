angular.module('pizzaDayApp')
    .controller('GroupDetailController', ['$scope', '$stateParams', '$meteor', '$rootScope', '$modal',
        function ($scope, $stateParams, $meteor, $rootScope, $modal) {

            var events = $meteor.collection(Events).subscribe('events');
            //TODO add group validation
            var group_id = $stateParams.id;
            $meteor.subscribe('groups').then(function (subsHandler) {
                $scope.group = $meteor.object(Groups, group_id);
                $scope.isOwner = function (group) {
                    if (!group) return false;
                    return $rootScope.currentUser._id == group.owner._id;
                };
            });
            //console.log($(".input-group.date"));
            //$(".input-group.date").datepicker({
            //    startDate: new Date(),
            //    format: 'mm-dd-yyyy'
            //});
            $meteor.subscribe('events', group_id).then(function (subsHandler) {
                $scope.events = $meteor.collection(Events);
                $scope.current_event = $meteor.object(Events, {group: group_id, active: true});

                $meteor.subscribe('orders', $scope.current_event._id).then(function (subsHandler) {
                        $scope.order = $meteor.object(Orders, {
                            event: $scope.current_event._id,
                            user: $rootScope.currentUser._id
                        });
                        $scope.order.isConfirmed = function () {
                            return this.status === "confirmed";
                        };
                        $scope.order.isCreated = function () {
                            return this.status === "created";
                        };
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
            $scope.newDish = {};
            $scope.addDish = function (newDish) {
                newDish.group = $scope.group._id;
                newDish.owner = $rootScope.currentUser._id;
                $meteor.call('addDish', newDish).then(
                    function (result) {
                        $scope.newDish = {};
                        $('#addDishModal').modal('hide');
                        //    TODO add noty call
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
                        //    TODO add noty call
                    })
            };
            $scope.confirmOrder = function (order) {
                $meteor.call('confirmOrder', order._id).then(function (result) {
                        noty({text: 'Order successfully confirmed', layout: 'topRight', type: 'success', timeout: true});
                    },
                    function (err) {
                        noty({text: 'Error confirm order ' + err.message, layout: 'topRight', type: 'error'});
                    });
            };
            $scope.orderDish = function (dish) {
                var order = {
                    dish: dish,
                    event: $scope.current_event._id,
                    group: $scope.group._id
                };
                $meteor.call('orderDish', order).then(function (result) {
                        noty({text: 'Dish added to order', layout: 'topRight', type: 'success', timeout: true});
                    },
                    function (err) {
                        noty({text: 'Error order ' + err.message, layout: 'topRight', type: 'error'});
                    })
            };
            $scope.updateDishOrder = function (dish, order) {
                $meteor.call('updateDishOrder', dish._id, order._id, dish.count).then(function (result) {
                        console.log('success update dish order');
                    },
                    function (err) {
                        noty({text: 'Error update dish order ' + err.message, layout: 'topRight', type: 'error'});
                    })
            };
            $scope.removeCoupon = function (coupon) {
                $meteor.call('removeCoupon', coupon).then(function (result) {
                        console.log('success remove');
                    },
                    function (err) {
                        console.log('error remove coupon' + err.message);
                        //    TODO add noty call
                    });
            };
            $scope.newCoupon = {};
            $scope.addCoupon = function (coupon) {
                coupon.group = group_id;
                $meteor.call('addCoupon', coupon).then(function (result) {
                        $('#addCouponModal').modal('hide');
                        $scope.newCoupon = {};
                        console.log('success add');
                    },
                    function (err) {
                        console.log('error add coupon' + err.message);
                    });
            };
            $scope.newEvent = {};
            $scope.addEvent = function (event) {
                event.group = $scope.group._id;
                $meteor.call('addEvent', event).then(function (result) {
                        $('#addEventModal').modal('hide');
                        $scope.newEvent = {};
                        //    TODO noty call add
                    },
                    function (err) {
                        console.log('error add event' + err.message);
                    });
            };
            $scope.removeEvent = function (event) {
                $scope.events.remove(event);
            };
            $scope.editedDish = {};
            $scope.openEditDish = function (_dish) {

                var modalInstance = $modal.open({
                    controller: "EditDishModalCtrl",
                    templateUrl: 'editDishModalContent.html',
                    resolve: {
                        dish: function () {
                            return _dish;
                        }
                    }
                });

            };
        }
    ])
    .controller('EditDishModalCtrl', ['$scope', '$meteor', '$modalInstance', 'dish', function ($scope, $meteor, $modalInstance, dish) {
        $scope.dish = dish;
        $scope.editDish = function (dish_id, editedDish) {
            editedDish._id = dish_id;
            $meteor.call('editDish', editedDish).then(function (result) {
                    console.log('success add event');
                    $modalInstance.close(result);
                    //    TODO noty call add
                },
                function (err) {
                    console.log('error add event' + err.message);
                });
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    }])
;