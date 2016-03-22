Meteor.publish("coupons", function (group_id) {
    //TODO add getOr404 selector, collection, object name
    return Coupons.find({group: group_id});
});

