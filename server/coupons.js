Meteor.publish("coupons", function () {
  return Coupons.find({});
});

