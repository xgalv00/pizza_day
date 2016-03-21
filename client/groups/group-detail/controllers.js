angular.module('pizzaDayApp')
    .controller('GroupDetailController', ['$scope', '$stateParams', '$meteor',
            function ($scope, $stateParams, $meteor) {

                var events = $meteor.collection(Events).subscribe('events');
                //TODO add group validation
                var group_id = $stateParams.id;
                console.log(group_id);
                $scope.group = $meteor.object(Groups, group_id).subscribe('groups');
                //TODO rewrite with fetch one item from db
                $scope.event = events[0];
                $scope.users = $meteor.collection(Meteor.users, false).subscribe('group_users');
                $scope.dishes = $meteor.collection(Dishes).subscribe('dishes');
                $scope.coupons = $meteor.collection(Coupons).subscribe('coupons');

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