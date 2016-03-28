// first, remove configuration entry in case service is already configured
ServiceConfiguration.configurations.remove({
    service: "google"
});
ServiceConfiguration.configurations.insert({
    service: "google",
    clientId: Meteor.settings.googleClientId,
    loginStyle: "popup",
    secret: Meteor.settings.googleSecret
});

Meteor.publish("group_users", function (group) {
    return Meteor.users.find({groups: {$in: [group]}}, {fields: {groups: 1, emails: 1, profile: 1}});
});

Meteor.publish("users", function () {
    return Meteor.users.find({}, {fields: {groups: 1, emails: 1, profile: 1}});
});
