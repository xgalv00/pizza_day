'use strict';

angular.module('confusionApp')

    .controller('GroupListController', ['$scope', 'groupListFactory', function($scope, groupListFactory){
        $scope.groups = groupListFactory.getGroups();
    }])

    .controller('GroupDetailController', ['$scope', '$stateParams', 'groupListFactory', 'groupDetailFactory',
        function ($scope, $stateParams, groupListFactory, groupDetailFactory) {
            //TODO add group validation
            var group_id = parseInt($stateParams.id, 10);

            $scope.group = groupListFactory.getGroup(group_id);
            $scope.event = groupDetailFactory.getEvent();
            $scope.users = groupDetailFactory.getUsers();
            $scope.dishes = groupDetailFactory.getDishes();
            $scope.coupons = groupDetailFactory.getCoupons();

        }
    ])

    .controller('MenuController', ['$scope', 'menuFactory', function ($scope, menuFactory) {

        $scope.tab = 1;
        $scope.filtText = '';
        $scope.showDetails = false;

        $scope.dishes = menuFactory.getDishes();


        $scope.select = function (setTab) {
            $scope.tab = setTab;

            if (setTab === 2) {
                $scope.filtText = "appetizer";
            }
            else if (setTab === 3) {
                $scope.filtText = "mains";
            }
            else if (setTab === 4) {
                $scope.filtText = "dessert";
            }
            else {
                $scope.filtText = "";
            }
        };

        $scope.isSelected = function (checkTab) {
            return ($scope.tab === checkTab);
        };

        $scope.toggleDetails = function () {
            $scope.showDetails = !$scope.showDetails;
        };
    }])

    .controller('ContactController', ['$scope', function ($scope) {

        $scope.feedback = {mychannel: "", firstName: "", lastName: "", agree: false, email: ""};

        var channels = [{value: "tel", label: "Tel."}, {value: "Email", label: "Email"}];

        $scope.channels = channels;
        $scope.invalidChannelSelection = false;

    }])

    .controller('FeedbackController', ['$scope', function ($scope) {

        $scope.sendFeedback = function () {

            console.log($scope.feedback);

            if ($scope.feedback.agree && ($scope.feedback.mychannel === "")) {
                $scope.invalidChannelSelection = true;
                console.log('incorrect');
            }
            else {
                $scope.invalidChannelSelection = false;
                $scope.feedback = {mychannel: "", firstName: "", lastName: "", agree: false, email: ""};
                $scope.feedback.mychannel = "";
                $scope.feedbackForm.$setPristine();
                console.log($scope.feedback);
            }
        };
    }])

    .controller('DishCommentController', ['$scope', function ($scope) {

        $scope.mycomment = {rating: 5, comment: "", author: "", date: ""};

        $scope.submitComment = function () {

            $scope.mycomment.date = new Date().toISOString();
            console.log($scope.mycomment);

            $scope.dish.comments.push($scope.mycomment);

            $scope.commentForm.$setPristine();

            $scope.mycomment = {rating: 5, comment: "", author: "", date: ""};
        };
    }])
    .controller('IndexController', ['$scope', 'corporateFactory', 'menuFactory', function ($scope, corporateFactory, menuFactory) {
        $scope.dish = menuFactory.getDish(3);
        $scope.promo = menuFactory.getPromotion(0);
        $scope.leader = corporateFactory.getLeader(0);
    }])
    // implement the IndexController and About Controller here


;