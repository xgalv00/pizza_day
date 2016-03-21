Meteor.publish("dishes", function () {
    return Dishes.find({});
});

Meteor.publish("group_dishes", function (group_id) {
    return Dishes.find({group: group_id});
});

