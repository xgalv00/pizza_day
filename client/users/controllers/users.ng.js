angular.module('pizzaDayApp')
    .controller('UserListController', ['$scope', '$meteor',
            function ($scope, $meteor) {
                $scope.users = $meteor.collection(Meteor.users, false).subscribe('users');
                $scope.owner_groups = $meteor.collection(Groups).subscribe('owner_groups');
                $scope.removeCoupon = function (coupon) {
                    $scope.coupons.remove(coupon);
                };
                $scope.addUserToGroup = function (userId) {
                    $scope.coupons.save(coupon);
                    $('#addCouponModal').modal('hide');
                };

            }
        ]);
