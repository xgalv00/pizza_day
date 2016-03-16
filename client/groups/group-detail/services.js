angular.module('pizzaDayApp')
        .service('groupDetailFactory', ['$meteor', function ($meteor) {
            var users = $meteor.collection(Meteor.users, false).subscribe('group_users');
            var dishes = $meteor.collection(Dishes).subscribe('dishes');
            var events = $meteor.collection(Events).subscribe('events');
            var coupons = $meteor.collection(Coupons).subscribe('coupons');
            this.getEvents = function () {
                return events;
            };
            //this.getEvent = function() {
            //    return $meteor.object(Events);
            //};
            this.getUsers = function () {
                return users;
            };
            this.getDishes = function () {
                return dishes;
            };
            this.getCoupons = function () {
                return coupons;
            }

        }]);