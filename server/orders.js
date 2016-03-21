Meteor.publish("orders", function (group_id){
    var group = Groups.findOne(group_id);
    if (!group)
        throw new Meteor.Error(404, "No such group");
    var user = this.userId;
    var event = Events.findOne({group: group._id, active: true})
    return Orders.find();
});
