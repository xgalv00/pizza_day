/**
 * Created by xgalv00 on 11.03.16.
 */
Events = new Mongo.Collection("events");
Groups = new Mongo.Collection("groups");
Dishes = new Mongo.Collection("dishes");
Orders = new Mongo.Collection("orders");
Coupons = new Mongo.Collection("coupons");
Users = new Mongo.Collection("users");

if (Meteor.isServer) {
    Meteor.startup(function () {
        // code to run on server at startup
        //Groups.insert(
        //    {
        //        name: 'Uthapizza',
        //        image: 'images/uthapizza.png',
        //        owner: {_id: 0, email: "example@example.com"}
        //    });
        //Groups.insert(
        //    {
        //        name: 'Zucchipakoda',
        //        image: 'images/zucchipakoda.png',
        //        owner: {_id: 0, email: "example@example.com"}
        //    });
        //Events.insert(
        //    {
        //        group: 1,
        //        users: [
        //            {
        //                _id: 0,
        //                items: [
        //                    {
        //                        _id: 0,
        //                        name: 'Uthapizza',
        //                        price: '1233.12'
        //                    },
        //                    {
        //                        _id: 1,
        //                        name: 'Zucchipakoda',
        //                        price: '1233.12'
        //                    }
        //                ],
        //                total: '1110.12',
        //                email: 'mains@adsf.com'
        //            },
        //            {
        //                _id: 1,
        //                items: [
        //                    {
        //                        _id: 0,
        //                        name: 'Uthapizza',
        //                        price: '1233.12'
        //                    },
        //                    {
        //                        _id: 1,
        //                        name: 'Zucchipakoda',
        //                        price: '1233.12'
        //                    }
        //                ],
        //                total: '1110.12',
        //                email: 'mains@adsf.com'
        //            }
        //        ],
        //        confirm_users: [
        //            {
        //                _id: 0,
        //                email: 'mains@adsf.com'
        //            },
        //            {
        //                _id: 1,
        //                email: 'mains@adsf.com'
        //            }
        //        ]
        //    }
        //);
        //Users.insert({
        //    name: 'Uthapizza',
        //    image: 'images/uthapizza.png',
        //    email: 'mains@adsf.com'
        //});
        //Users.insert({
        //    name: 'Zucchipakoda',
        //    image: 'images/Zucchipakoda.png',
        //    email: 'mains@adsf.com'
        //});
        //Dishes.insert({
        //    name: 'Uthapizza',
        //    image: 'images/uthapizza.png',
        //    category: 'mains',
        //    label: 'Hot',
        //    price: '4.99',
        //    description: 'A unique combination of Indian Uthappam (pancake) and Italian pizza, topped with Cerignola olives, ripe vine cherry tomatoes, Vidalia onion, Guntur chillies and Buffalo Paneer.',
        //
        //});
        //Dishes.insert({
        //    name: 'Zucchipakoda',
        //    image: 'images/zucchipakoda.png',
        //    category: 'appetizer',
        //    label: '',
        //    price: '1.99',
        //    description: 'Deep fried Zucchini coated with mildly spiced Chickpea flour batter accompanied with a sweet-tangy tamarind sauce',
        //
        //});
        //Dishes.insert({
        //    name: 'Vadonut',
        //    image: 'images/vadonut.png',
        //    category: 'appetizer',
        //    label: 'New',
        //    price: '1.99',
        //    description: 'A quintessential ConFusion experience, is it a vada or is it a donut?',
        //
        //});
        //Dishes.insert({
        //    name: 'ElaiCheese Cake',
        //    image: 'images/elaicheesecake.png',
        //    category: 'dessert',
        //    label: '',
        //    price: '2.99',
        //    description: 'A delectable, semi-sweet New York Style Cheese Cake, with Graham cracker crust and spiced with Indian cardamoms',
        //
        //});
        //Coupons.insert({
        //    expire: new Date(),
        //    discount: '4123.99'
        //
        //});
        //Coupons.insert({
        //    expire: new Date(),
        //    discount: '1234.99'
        //
        //});
    });
}

if (Meteor.isClient) {
    // This code only runs on the client
    //app.js script
    angular.module('confusionApp', ['angular-meteor', 'ui.router'])
        .config(function ($stateProvider, $urlRouterProvider) {
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
                            templateUrl: 'client/views/groups.ng.html',
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
                            templateUrl: 'client/views/users.ng.html',
                            controller: 'MenuController'
                        }
                    }
                })

                // route for the group detail page
                .state('app.groupdetail', {
                    url: 'groups/:id',
                    views: {
                        'content@': {
                            templateUrl: 'client/views/group_detail.ng.html',
                            controller: 'GroupDetailController'
                        }
                    }
                });

            $urlRouterProvider.otherwise('/');
        })
    ;

    //controllers.js
    angular.module('confusionApp')

        .controller('GroupListController', ['$scope', 'groupListFactory', function ($scope, groupListFactory) {
            $scope.groups = groupListFactory.getGroups();
        }])

        .controller('GroupDetailController', ['$scope', '$stateParams', 'groupListFactory', 'groupDetailFactory',
            function ($scope, $stateParams, groupListFactory, groupDetailFactory) {
                //TODO add group validation
                var group_id = parseInt($stateParams.id, 10);
                var events = groupDetailFactory.getEvents();
                $scope.group = groupListFactory.getGroup(group_id);
                //TODO rewrite with fetch one item from db
                $scope.event = events[0];
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
    //service.js
    angular.module('confusionApp')
        .service('groupListFactory', ['$meteor', function ($meteor) {
            var groups = $meteor.collection(Groups);
            this.getGroups = function () {
                return groups;
            };
            this.getGroup = function (index) {

                return groups[index];
            };
        }])
        .service('groupDetailFactory', ['$meteor',function ($meteor) {
            this.getEvents = function () {
                return $meteor.collection(Events);
            };
            this.getUsers = function () {
                return $meteor.collection(Users);
            };
            this.getDishes = function () {
                return $meteor.collection(Dishes);
            };
            this.getCoupons = function () {
                return $meteor.collection(Coupons);
            }

        }])
        .service('menuFactory', function () {

            var dishes = [
                {
                    _id: 0,
                    name: 'Uthapizza',
                    image: 'images/uthapizza.png',
                    category: 'mains',
                    label: 'Hot',
                    price: '4.99',
                    description: 'A unique combination of Indian Uthappam (pancake) and Italian pizza, topped with Cerignola olives, ripe vine cherry tomatoes, Vidalia onion, Guntur chillies and Buffalo Paneer.',
                },
                {
                    _id: 1,
                    name: 'Zucchipakoda',
                    image: 'images/zucchipakoda.png',
                    category: 'appetizer',
                    label: '',
                    price: '1.99',
                    description: 'Deep fried Zucchini coated with mildly spiced Chickpea flour batter accompanied with a sweet-tangy tamarind sauce',
                },
                {
                    _id: 2,
                    name: 'Vadonut',
                    image: 'images/vadonut.png',
                    category: 'appetizer',
                    label: 'New',
                    price: '1.99',
                    description: 'A quintessential ConFusion experience, is it a vada or is it a donut?',
                },
                {
                    _id: 3,
                    name: 'ElaiCheese Cake',
                    image: 'images/elaicheesecake.png',
                    category: 'dessert',
                    label: '',
                    price: '2.99',
                    description: 'A delectable, semi-sweet New York Style Cheese Cake, with Graham cracker crust and spiced with Indian cardamoms',
                }
            ];
            var promotions = [
                {
                    _id: 0,
                    name: 'Weekend Grand Buffet',
                    image: 'images/buffet.png',
                    label: 'New',
                    price: '19.99',
                    description: 'Featuring mouthwatering combinations with a choice of five different salads, six enticing appetizers, six main entrees and five choicest desserts. Free flowing bubbly and soft drinks. All for just $19.99 per person ',
                }

            ];

            this.getDishes = function () {

                return dishes;

            };

            this.getDish = function (index) {

                return dishes[index];
            };

            // implement a function named getPromotion
            // that returns a selected promotion.
            this.getPromotion = function (index) {
                return promotions[index];
            }

        })

        .factory('corporateFactory', function () {

            var corpfac = {};

            var leaders = [
                {
                    name: "Peter Pan",
                    image: 'images/alberto.png',
                    designation: "Chief Epicurious Officer",
                    abbr: "CEO",
                    description: "Our CEO, Peter, credits his hardworking East Asian immigrant parents who undertook the arduous journey to the shores of America with the intention of giving their children the best future. His mother's wizardy in the kitchen whipping up the tastiest dishes with whatever is available inexpensively at the supermarket, was his first inspiration to create the fusion cuisines for which The Frying Pan became well known. He brings his zeal for fusion cuisines to this restaurant, pioneering cross-cultural culinary connections."
                },
                {
                    name: "Dhanasekaran Witherspoon",
                    image: 'images/alberto.png',
                    designation: "Chief Food Officer",
                    abbr: "CFO",
                    description: "Our CFO, Danny, as he is affectionately referred to by his colleagues, comes from a long established family tradition in farming and produce. His experiences growing up on a farm in the Australian outback gave him great appreciation for varieties of food sources. As he puts it in his own words, Everything that runs, wins, and everything that stays, pays!"
                },
                {
                    name: "Agumbe Tang",
                    image: 'images/alberto.png',
                    designation: "Chief Taste Officer",
                    abbr: "CTO",
                    description: "Blessed with the most discerning gustatory sense, Agumbe, our CFO, personally ensures that every dish that we serve meets his exacting tastes. Our chefs dread the tongue lashing that ensues if their dish does not meet his exacting standards. He lives by his motto, You click only if you survive my lick."
                },
                {
                    name: "Alberto Somayya",
                    image: 'images/alberto.png',
                    designation: "Executive Chef",
                    abbr: "EC",
                    description: "Award winning three-star Michelin chef with wide International experience having worked closely with whos-who in the culinary world, he specializes in creating mouthwatering Indo-Italian fusion experiences. He says, Put together the cuisines from the two craziest cultures, and you get a winning hit! Amma Mia!"
                }

            ];

            // Implement two functions, one named getLeaders,
            // the other named getLeader(index)
            // Remember this is a factory not a service
            corpfac.getLeaders = function () {
                return leaders
            };
            corpfac.getLeader = function (index) {
                return leaders[index]
            };
            return corpfac

        })

    ;

}//end isClient check
