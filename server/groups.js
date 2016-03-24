Meteor.publish("groups", function () {
    return Groups.find({});
});

Meteor.publish("owner_groups", function () {
    console.log(this.userId);
  return Groups.find({owner: this.userId});
});