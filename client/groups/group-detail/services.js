angular.module('pizzaDayApp')
        .service('groupDetailFactory', ['$meteor', function ($meteor) {
            this.getEvents = function () {
                return $meteor.collection(Events);
            };
            //this.getEvent = function() {
            //    return $meteor.object(Events);
            //};
            this.getUsers = function () {
                return [];
            };
            this.getDishes = function () {
                return $meteor.collection(Dishes);
            };
            this.getCoupons = function () {
                return $meteor.collection(Coupons);
            }

        }]);