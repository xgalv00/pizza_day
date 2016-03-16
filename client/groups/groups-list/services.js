angular.module('pizzaDayApp')
        .service('groupListFactory', ['$meteor', function ($meteor) {
            var groups = $meteor.collection(Groups).subscribe('groups');
            var images = $meteor.collectionFS(Images, false, Images).subscribe('images');
            this.getGroups = function () {
                return groups;
            };
            this.getGroup = function (index) {
                return groups[index];
            };
            this.getImages = function (){
                return images;
            }
        }]);