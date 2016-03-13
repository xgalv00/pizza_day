angular.module('pizzaDayApp')
    .controller('GroupDetailController', ['$scope', '$stateParams', 'groupListFactory', 'groupDetailFactory',
            function ($scope, $stateParams, groupListFactory, groupDetailFactory) {
                //TODO add group validation
                var group_id = parseInt($stateParams.id, 10);
                var events = groupDetailFactory.getEvents();
                $scope.group = groupListFactory.getGroup(group_id);
                //TODO rewrite with fetch one item from db
                $scope.event = events[0];
                $scope.users = groupDetailFactory.getUsers();
                $scope.dishes = groupDetailFactory.getDishes();
                $scope.coupons = groupDetailFactory.getCoupons();
                $scope.removeCoupon = function (coupon) {
                    $scope.coupons.remove(coupon);
                };
                $scope.addCoupon = function (coupon) {
                    $scope.coupons.save(coupon);
                    $('#addCouponModal').modal('hide');
                //    TODO add server side validation
                };

            }
        ]);