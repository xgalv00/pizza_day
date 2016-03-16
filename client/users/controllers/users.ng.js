angular.module('pizzaDayApp')
    .controller('UserListController', ['$scope', 'userListFactory',
            function ($scope, userListFactory) {
                $scope.users = userListFactory.getAllUsers();
                $scope.removeCoupon = function (coupon) {
                    $scope.coupons.remove(coupon);
                };
                $scope.addCoupon = function (coupon) {
                    $scope.coupons.save(coupon);
                    $('#addCouponModal').modal('hide');
                };

            }
        ]);
