Meteor.publish("coupons", function (group_id) {
    return Coupons.find({group: group_id});
});

