Meteor.publish("groups", function () {
    return Groups.find({});
});

Meteor.publish("owner_groups", function () {
  return Groups.find({owner: this.userId});
});