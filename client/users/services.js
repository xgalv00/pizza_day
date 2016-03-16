angular.module('pizzaDayApp')
        .service('userListFactory', ['$meteor', function ($meteor) {
            var users = $meteor.collection(Meteor.users, false).subscribe('users');
            this.getAllUsers = function () {
                return users;
            };
        }]);
