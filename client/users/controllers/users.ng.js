angular.module('pizzaDayApp')
    .controller('UserListController', ['$scope', '$meteor', '$modal', '$rootScope',
        function ($scope, $meteor, $modal, $rootScope) {
            var owner_groups = $meteor.collection(Groups).subscribe('owner_groups');
            $scope.users = $meteor.collection(Meteor.users, false).subscribe('users');

            $scope.ifCouldBeAdded = function (user) {
                return function () {   // inner function
                    if (user._id == $rootScope.currentUser._id) {
                        return false
                    }
                    if (!user.groups) {
                        return true;
                    }
                    // here because if will be after owner_groups will be empty array
                    // maybe there will be problems with "magic" reactivity
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
                //TODO add confirmation messages for user
                console.log('add user success');
                $modalInstance.close(result);
            }, function (err) {
                console.log('Error adding user ' + err.message);
            });
        };
        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    }])

;
