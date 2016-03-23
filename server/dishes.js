Meteor.publish("dishes", function () {
    return Dishes.find({});
});

Meteor.publish("group_dishes", function (group_id) {
    return Dishes.find({group: group_id});
});

//TODO test multiple subscription for coupon dishes
//Meteor.publish("group_coupon_dishes", function (group_id, test) {
//    var coupons = Coupons.find({group: group_id});
//    var exclude_dishes = [];
//    coupons.forEach(function(element, index, iter){
//        exclude_dishes.push(element.dish._id);
//    });
//    return Dishes.find({group: group_id, _id:{$nin: exclude_dishes}})
//});

