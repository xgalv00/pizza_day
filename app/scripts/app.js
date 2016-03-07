'use strict';

angular.module('confusionApp', ['ui.router'])
.config(function($stateProvider, $urlRouterProvider) {
        $stateProvider

            // route for the home page
            .state('app', {
                url:'/',
                views: {
                    'header': {
                        templateUrl : 'views/header.html',
                    },
                    'content': {
                        templateUrl : 'views/home.html',
                        controller  : 'IndexController'
                    },
                    'footer': {
                        templateUrl : 'views/footer.html',
                    }
                }

            })

            // route for the group list page
            .state('app.groups', {
                url:'groups',
                views: {
                    'content@': {
                        templateUrl : 'views/groups.html',
                        controller  : 'GroupListController'
                    }
                }
            })

            // route for the contactus page
            .state('app.contactus', {
                url:'contactus',
                views: {
                    'content@': {
                        templateUrl : 'views/contactus.html',
                        controller  : 'ContactController'
                    }
                }
            })

            // route for the user list page
            .state('app.users', {
                url: 'users',
                views: {
                    'content@': {
                        templateUrl : 'views/users.html',
                        controller  : 'MenuController'
                    }
                }
            })

            // route for the group detail page
            .state('app.groupdetail', {
                url: 'groups/:id',
                views: {
                    'content@': {
                        templateUrl : 'views/group_detail.html',
                        controller  : 'GroupDetailController'
                   }
                }
            });

        $urlRouterProvider.otherwise('/');
    })
;