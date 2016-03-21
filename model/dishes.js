Dishes = new Mongo.Collection("dishes");

Meteor.methods({
    addDish: function (dish) {
        // TODO add check for group
        Dishes.insert(dish);
    },
    removeDish: function (dish) {
        Dishes.remove(dish._id);
        //TODO add remove group from each user
    }
});