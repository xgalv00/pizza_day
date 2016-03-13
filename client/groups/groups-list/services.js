angular.module('pizzaDayApp')
        .service('groupListFactory', ['$meteor', function ($meteor) {
            var groups = $meteor.collection(Groups);
            this.getGroups = function () {
                return groups;
            };
            this.getGroup = function (index) {

                return groups[index];
            };
        }]);