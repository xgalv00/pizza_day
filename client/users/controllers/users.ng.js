angular.module('pizzaDayApp')
    .controller('UserListController', ['$scope', '$meteor', '$modal', '$rootScope',
        function ($scope, $meteor, $modal, $rootScope) {
            $scope.$meteorSubscribe('users').then(function (subsHandler) {
                $scope.users = $meteor.collection(Meteor.users, false);
            });

            $scope.$meteorSubscribe('groups').then(function (subsHandler) {
                var owner_groups = $meteor.collection(function () {
                    return Groups.find ({owner: $rootScope.currentUser._id});
                });
                $scope.ifCouldBeAdded = function (user) {
                    return function () {   // inner function
                        if (user._id == $rootScope.currentUser._id) {
                            return false
                        }
                        if (!user.groups && owner_groups.length > 0) {
                            return true;
                        }
                        let owner_groups_ids = [];
                        for (let group of owner_groups) {
                            owner_groups_ids.push(group._id);
                        }
                        return _.intersection(user.groups, owner_groups_ids).length != owner_groups_ids.length;
                    }();
                };

                $scope.open = function (_user) {

                    var modalInstance = $modal.open({
                        controller: "AddUserToGroupModalCtrl",
                        templateUrl: 'addToGroupModalContent.ng.html',
                        resolve: {
                            user: function () {
                                return _user;
                            },
                            owner_groups: function () {
                                return owner_groups
                            }
                        }
                    });

                };
            });


        }
    ])
    .controller('AddUserToGroupModalCtrl', ['$scope', '$meteor', '$modalInstance', 'user', 'owner_groups', function ($scope, $meteor, $modalInstance, user, owner_groups) {
        $scope.user = user;


        $scope.owner_groups = owner_groups
            .filter(function (el) {
                if (!user.groups) {
                    return true;
                }
                return user.groups.indexOf(el._id) < 0;
            });
        $scope.addUserToGroup = function (userId, groupId) {
            $meteor.call('addUser', userId, groupId).then(function (result) {
                $modalInstance.close(result);
                noty({text: 'add user success', type: 'success', layout: 'topRight', timeout: true});
            }, function (err) {
                noty({text: 'Error adding user: ' + err.message, type: 'error', layout: 'topRight'});
            });
        };
        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    }])

;
