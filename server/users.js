Meteor.publish("group_users", function () {
    return Meteor.users.find({}, {fields: {groups: 1, emails: 1, profile: 1}});
});

Meteor.publish("users", function () {
    return Meteor.users.find({}, {fields: {groups: 1, emails: 1, profile: 1}});
});
