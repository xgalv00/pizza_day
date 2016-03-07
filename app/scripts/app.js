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
            .state('app.group', {
                url:'group',
                views: {
                    'content@': {
                        templateUrl : 'views/group.html',
                        controller  : 'AboutController'
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
            .state('app.user', {
                url: 'user',
                views: {
                    'content@': {
                        templateUrl : 'views/user.html',
                        controller  : 'MenuController'
                    }
                }
            })

            // route for the group detail page
            .state('app.groupdetail', {
                url: 'group/:id',
                views: {
                    'content@': {
                        templateUrl : 'views/group_detail.html',
                        controller  : 'DishDetailController'
                   }
                }
            });

        $urlRouterProvider.otherwise('/');
    })
;