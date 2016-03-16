angular.module('pizzaDayApp')
        .service('groupListFactory', ['$meteor', function ($meteor) {
            var groups = $meteor.collection(Groups).subscribe('groups');
            this.getGroups = function () {
                return groups;
            };
            this.getGroup = function (index) {

                return groups[index];
            };
        }]);