Groups = new Mongo.Collection("groups", {
    transform: function (doc) {
        doc.owner = Meteor.users.findOne({
            _id: doc.owner
        }, {fields: {emails: 1, profile: 1}});
        return doc;
    }
});

//Groups.allow({
//    insert: function (userId) {
//      return (userId ? true : false);
//    },
//    remove: function (userId) {
//      return (userId ? true : false);
//    },
//    update: function (userId) {
//      return (userId ? true : false);
//    }
//  });

Meteor.methods({
    addUser: function (userId, groupId) {
        check(userId, nonEmptyString);
        check(groupId, nonEmptyString);
        //check(group, {
        //    name: String,
        //    image: Date
        //});
        var user = Meteor.users.findOne(userId);
        var group = Groups.findOne(groupId);
        if (!user)
            throw new Meteor.Error(404, "No such user");
        if (!group)
            throw new Meteor.Error(404, "No such group");
        Meteor.users.update(userId, {$addToSet: {groups: groupId}});
        Groups.update(groupId, {$addToSet: {users: userId}});
    },
    addGroup: function (group) {
        // TODO add check for group
        Groups.insert(group);
    },
    removeGroup: function (group) {
        Groups.remove(group._id);
        //TODO add remove group from each user
    }

    //invite: function (partyId, userId) {
    //    check(partyId, String);
    //    check(userId, String);
    //    var party = Parties.findOne(partyId);
    //    if (!party)
    //        throw new Meteor.Error(404, "No such party");
    //    if (party.owner !== this.userId)
    //        throw new Meteor.Error(404, "No such party");
    //    if (party.public)
    //        throw new Meteor.Error(400,
    //            "That party is public. No need to invite people.");
    //
    //    if (userId !== party.owner && !_.contains(party.invited, userId)) {
    //        Parties.update(partyId, {$addToSet: {invited: userId}});
    //
    //        var from = contactEmail(Meteor.users.findOne(this.userId));
    //        var to = contactEmail(Meteor.users.findOne(userId));
    //
    //        if (Meteor.isServer && to) {
    //            // This code only runs on the server. If you didn't want clients
    //            // to be able to see it, you could move it to a separate file.
    //            Email.send({
    //                from: "noreply@socially.com",
    //                to: to,
    //                replyTo: from || undefined,
    //                subject: "PARTY: " + party.title,
    //                text: "Hey, I just invited you to '" + party.title + "' on Socially." +
    //                "\n\nCome check it out: " + Meteor.absoluteUrl() + "\n"
    //            });
    //        }
    //    }
    //}
});

var contactEmail = function (user) {
    if (user.emails && user.emails.length)
        return user.emails[0].address;
    if (user.services && user.services.facebook && user.services.facebook.email)
        return user.services.facebook.email;
    return null;
};

var nonEmptyString = Match.Where(function (x) {
    check(x, String);
    return x.length > 0;
});