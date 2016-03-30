angular.module('pizzaDayApp')
    .controller('GroupDetailController', ['$scope', '$stateParams', '$meteor', '$rootScope', '$modal',
        function ($scope, $stateParams, $meteor, $rootScope, $modal) {

            var group_id = $stateParams.id;

            $scope.$meteorSubscribe('groups').then(function (subsHandler) {
                $scope.group = $meteor.object(Groups, group_id);
                $scope.isOwner = function (group) {
                    return group && group.owner && ($rootScope.currentUser._id == group.owner._id);
                };
            });
            $scope.orderIsConfirmed = function (order) {
                return order && order.status === "confirmed";
            };
            $scope.orderIsCreated = function (order) {
                return order && order.status === "created";
            };

            $scope.$meteorSubscribe('events', group_id).then(function (subsHandler) {
                $scope.events = $meteor.collection(Events);
                $scope.current_event = $meteor.object(Events, {group: group_id, active: true}, false);
                $scope.datepickerStart = ($scope.current_event.date) ? $scope.current_event.date : new Date();
                $meteor.autorun($scope, function () {
                    $scope.$meteorSubscribe('orders', $scope.getReactively('current_event._id')).then(function (subsHandler) {
                            $scope.order = $meteor.object(Orders, {
                                event: $scope.current_event._id,
                                user: $rootScope.currentUser._id
                            }, false);
                        }
                    );
                    console.log('test autorun');
                });
            });

            $meteor.autorun($scope, function () {
                $scope.$meteorSubscribe('users').then(function (subsHandler) {
                    $scope.users = $meteor.collection(function () {
                        return Meteor.users.find ({_id: {$in: $scope.getReactively('group.users') || []}});
                    }, false);

                });
            });

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

            $scope.$meteorSubscribe('coupons', group_id).then(function (handle) {
                $scope.coupons = $meteor.collection(Coupons);
            });


            $scope.newEventStatus = "";
            $scope.newEvent = {};
            $scope.eventStatusChange = function (newEventStatus) {
                $meteor.call('changeEventStatus', $scope.current_event._id, newEventStatus).then(
                    function (result) {
                        console.log('status changed successfully');
                        if (result && result.delivered) {
                            $scope.current_event = $meteor.object(Events, {group: group_id, active: true}, false);
                            $scope.order = undefined;
                        }
                        $scope.current_event.reset();
                    },
                    function (err) {
                        noty({text: 'Event status change error: ' + err.message, type: 'error', layout: 'topRight'});
                    }
                );
            };
            $scope.addEvent = function (event) {
                event.group = $scope.group._id;
                $meteor.call('addEvent', event).then(function (result) {
                        $('#addEventModal').modal('hide');
                        $scope.newEvent = {};
                        $scope.current_event = $meteor.object(Events, {group: group_id, active: true}, false);
                        noty({text: 'Add event success', type: 'success', layout: 'topRight', timeout: true});
                    },
                    function (err) {
                        noty({text: 'Add event error: ' + err.message, type: 'error', layout: 'topRight'});
                    });
            };
            $scope.removeEvent = function (event) {
                $scope.events.remove(event);
            };


            $scope.confirmOrder = function (order) {
                $meteor.call('confirmOrder', order._id).then(function (result) {
                        $scope.current_event.reset();
                        $scope.order.reset();
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
                        if (result && result.created) {
                            $scope.current_event = $meteor.object(Events, {group: group_id, active: true}, false);
                            console.log($scope.current_event._id);
                            $scope.order = $meteor.object(Orders, {
                                event: $scope.current_event._id,
                                user: $rootScope.currentUser._id
                            }, false);
                        }
                    },
                    function (err) {
                        noty({text: 'Error order ' + err.message, layout: 'topRight', type: 'error'});
                    })
            };
            $scope.removeDishOrder = function (dish, order) {
                $meteor.call('removeDishOrder', dish._id, order._id).then(function (result) {
                        console.log('success update dish order');
                    },
                    function (err) {
                        noty({text: 'Error remove dish order ' + err.message, layout: 'topRight', type: 'error'});
                    })
            };
            $scope.updateDishOrder = function (dish, order) {
                //parseInt faster equivalent
                dish.count >>= 0;
                if (!(dish.count >= 1)) {
                    noty({text: 'Count should be greater than or equal 1', layout: 'topRight', type: 'error'});
                } else {
                    $meteor.call('updateDishOrder', dish._id, order._id, dish.count).then(function (result) {
                            console.log('success update dish order');
                        },
                        function (err) {
                            noty({text: 'Error update dish order ' + err.message, layout: 'topRight', type: 'error'});
                        });
                }
            };


            $scope.newDish = {};
            $scope.editedDish = {};
            $scope.addDish = function (newDish) {
                newDish.group = $scope.group._id;
                newDish.owner = $rootScope.currentUser._id;
                $meteor.call('addDish', newDish).then(
                    function (result) {
                        $scope.newDish = {};
                        $('#addDishModal').modal('hide');
                        noty({text: 'add dish success', type: 'success', layout: 'topRight', timeout: true});
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
                        noty({text: 'Error remove dish: ' + err.message, type: 'error', layout: 'topRight'});
                    })
            };
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


            $scope.removeUser = function (user) {
                $meteor.call('removeUser', user._id, $scope.group._id).then(
                    function (result) {
                        console.log("success");
                    },
                    function (err) {
                        noty({text: 'Error remove user from group ' + err.message, layout: 'topRight', type: 'error'});
                    }
                );
            };


            $scope.newCoupon = {};
            $scope.removeCoupon = function (coupon) {
                $meteor.call('removeCoupon', coupon).then(function (result) {
                        console.log('success remove');
                        $scope.order.reset();
                    },
                    function (err) {
                        console.log('error remove coupon' + err.message);
                        noty({text: 'Error remove coupon ' + err.message, layout: 'topRight', type: 'error'});
                    });
            };
            $scope.addCoupon = function (coupon) {
                coupon.group = group_id;
                $meteor.call('addCoupon', coupon).then(function (result) {
                        $('#addCouponModal').modal('hide');
                        $scope.newCoupon = {};
                        $scope.order.reset();
                        noty({text: 'Success add coupon', layout: 'topRight', type: 'success', timeout: true});
                    },
                    function (err) {
                        console.log('error add coupon' + err.message);
                    });
            };
        }
    ])
    .controller('EditDishModalCtrl', ['$scope', '$meteor', '$modalInstance', 'dish', function ($scope, $meteor, $modalInstance, dish) {
        $scope.dish = dish;
        $scope.editDish = function (dish_id, editedDish) {
            editedDish._id = dish_id;
            $meteor.call('editDish', editedDish).then(function (result) {
                    $modalInstance.close(result);
                    noty({text: 'Edit dish success', type: 'success', layout: 'topRight', timeout: true});
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