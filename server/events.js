Meteor.publish("events", function (group_id) {
    var group = Groups.findOne(group_id);
    if (!group)
        throw new Meteor.Error(404, "No such group");
    return Events.find({group: group});
});