angular.module('pizzaDayApp')
    .config(function ($stateProvider, $urlRouterProvider, $locationProvider) {
        $locationProvider.html5Mode(true);
        $stateProvider

        // route for the home page
            .state('app', {
                url: '/',
                views: {
                    'header': {
                        templateUrl: 'client/views/header.ng.html',
                    },
                    'content': {
                        templateUrl: 'client/views/home.ng.html',
                        controller: 'IndexController'
                    },
                    'footer': {
                        templateUrl: 'client/views/footer.ng.html',
                    }
                }

            })

            // route for the group list page
            .state('app.groups', {
                url: 'groups',
                views: {
                    'content@': {
                        templateUrl: 'client/groups/groups-list/groups.ng.html',
                        controller: 'GroupListController'
                    }
                }
            })

            // route for the contactus page
            .state('app.contactus', {
                url: 'contactus',
                views: {
                    'content@': {
                        templateUrl: 'client/views/contactus.ng.html',
                        controller: 'ContactController'
                    }
                }
            })

            // route for the user list page
            .state('app.users', {
                url: 'users',
                views: {
                    'content@': {
                        templateUrl: 'client/users/views/users.ng.html',
                        controller: 'UserListController'
                    }
                }
            })

            // route for the group detail page
            .state('app.groupdetail', {
                url: 'groups/:id',
                views: {
                    'content@': {
                        templateUrl: 'client/groups/group-detail/group-detail.ng.html',
                        controller: 'GroupDetailController'
                    }
                }
            })
            .state('app.login', {
                url: 'login',
                views: {
                    'content@': {
                        templateUrl: 'client/users/views/login.ng.html',
                        controller: 'LoginCtrl',
                        controllerAs: 'lc'
                    }
                }
            })
            .state('app.register', {
                url: 'register',
                views: {
                    'content@': {
                        templateUrl: 'client/users/views/register.ng.html',
                        controller: 'RegisterCtrl',
                        controllerAs: 'rc'
                    }
                }
            })
            .state('app.resetpw', {
                url: 'resetpw',
                views: {
                    'content@': {
                        templateUrl: 'client/users/views/reset-password.ng.html',
                        controller: 'ResetCtrl',
                        controllerAs: 'rpc'
                    }
                }
            })
            .state('app.logout', {
                url: 'logout',
                resolve: {
                    "logout": function ($meteor, $state) {
                        return $meteor.logout().then(function () {
                            $state.go('app.groups');
                        }, function (err) {
                            console.log('logout error - ', err);
                        });
                    }
                }
            })
        ;

        $urlRouterProvider.otherwise('/');
    })
    .run(function ($rootScope, $state) {
        $rootScope.$on('$stateChangeError', function (event, toState, toParams, fromState, fromParams, error) {
            // We can catch the error thrown when the $requireUser promise is rejected
            // and redirect the user back to the main page
            if (error === 'AUTH_REQUIRED') {
                $state.go('app.login');
            }
        });
    });