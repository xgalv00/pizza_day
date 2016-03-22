Meteor.publish("orders", function (event_id){
    var event = Events.findOne(event_id);
    if (!event)
        throw new Meteor.Error(404, "No such event");
    return Orders.find({event: event._id});
});
