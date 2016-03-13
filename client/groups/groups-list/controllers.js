angular.module('pizzaDayApp')

        .controller('GroupListController', ['$scope', 'groupListFactory', function ($scope, groupListFactory) {
            $scope.groups = groupListFactory.getGroups();
        }]);