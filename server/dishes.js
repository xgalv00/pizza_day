Meteor.publish("dishes", function () {
  return Dishes.find({});
});

