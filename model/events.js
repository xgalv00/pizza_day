Events = new Mongo.Collection("events");

Meteor.methods({
    addEvent: function (event) {
        // TODO add check for group
        Events.insert(event);
    },
    removeEvent: function (event) {
        Events.remove(event._id);
    }
});